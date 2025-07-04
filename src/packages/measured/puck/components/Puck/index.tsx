/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";

import type {
    Config,
    Data,
    IframeConfig,
    InitialHistory,
    Metadata,
    OnAction,
    Overrides,
    Permissions,
    Plugin,
    UiState,
    UserGenerics,
} from "../../types";
import {Viewports} from "../../types";

import {SidebarSection} from "../SidebarSection";
import {getItem} from "../../lib/get-item";
import {createReducer, PuckAction} from "../../reducer";
import {flushZones} from "../../lib/flush-zones";
import getClassNameFactory from "../../lib/get-class-name-factory";
import {AppProvider, defaultAppState} from "./context";
import styles from "./styles.module.css";
import {Fields} from "./components/Fields";
import {Components} from "./components/Components";
import {Preview} from "./components/Preview";
import {Outline} from "./components/Outline";
import {usePuckHistory} from "../../lib/use-puck-history";
import {useHistoryStore} from "../../lib/use-history-store";
import {Canvas} from "./components/Canvas";
import {defaultViewports} from "../ViewportControls/default-viewports";
import {DragDropContext} from "../DragDropContext";
import {useLoadedOverrides} from "../../lib/use-loaded-overrides";
import {DefaultOverride} from "../DefaultOverride";
import {useInjectGlobalCss} from "../../lib/use-inject-css";
import {usePreviewModeHotkeys} from "../../lib/use-preview-mode-hotkeys";
import {Header, HeaderContext} from "./components/Header";

const getClassName = getClassNameFactory("Puck", styles);
const getLayoutClassName = getClassNameFactory("PuckLayout", styles);

export function Puck<
    UserConfig extends Config = Config,
    G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
    >({
          children,
          config,
          data: initialData,
          ui: initialUi,
          onChange,
          onPublish,
          onAction,
          permissions = {},
          plugins,
          overrides,
          renderHeader,
          renderHeaderActions,
          headerTitle,
          headerPath,
          viewports = defaultViewports,
          iframe: _iframe,
          dnd,
          initialHistory: _initialHistory,
          metadata,
      }: {
    children?: ReactNode;
    config: UserConfig;
    data: Partial<G["UserData"] | Data>;
    ui?: Partial<UiState>;
    onChange?: (data: G["UserData"]) => void;
    onPublish?: (data: G["UserData"]) => void;
    onAction?: OnAction<G["UserData"]>;
    permissions?: Partial<Permissions>;
    plugins?: Plugin[];
    overrides?: Partial<Overrides>;
    renderHeader?: (props: {
        children: ReactNode;
        dispatch: (action: PuckAction) => void;
        state: G["UserAppState"];
    }) => ReactElement;
    renderHeaderActions?: (props: {
        state: G["UserAppState"];
        dispatch: (action: PuckAction) => void;
    }) => ReactElement;
    headerTitle?: string;
    headerPath?: string;
    viewports?: Viewports;
    iframe?: IframeConfig;
    dnd?: {
        disableAutoScroll?: boolean;
    };
    initialHistory?: InitialHistory;
    metadata?: Metadata;
}) {
    const iframe: IframeConfig = {
        enabled: true,
        waitForStyles: true,
        ..._iframe,
    };
    
    useInjectGlobalCss(iframe.enabled);
    
    const [generatedAppState] = useState<G["UserAppState"]>(() => {
        const initial = { ...defaultAppState.ui, ...initialUi };
        
        let clientUiState: Partial<G["UserAppState"]["ui"]> = {};
        
        if (typeof window !== "undefined") {
            // Hide side bars on mobile
            if (window.matchMedia("(max-width: 638px)").matches) {
                clientUiState = {
                    ...clientUiState,
                    leftSideBarVisible: false,
                    rightSideBarVisible: false,
                };
            }
            
            const viewportWidth = window.innerWidth;
            
            const viewportDifferences = Object.entries(viewports)
                .map(([key, value]) => ({
                    key,
                    diff: Math.abs(viewportWidth - value.width),
                }))
                .sort((a, b) => (a.diff > b.diff ? 1 : -1));
            
            const closestViewport = viewportDifferences[0].key as any;
            
            if (iframe.enabled) {
                clientUiState = {
                    ...clientUiState,
                    viewports: {
                        ...initial.viewports,
                        current: {
                            ...initial.viewports.current,
                            height:
                                initialUi?.viewports?.current?.height ||
                                viewports[closestViewport]?.height ||
                                "auto",
                            width:
                                initialUi?.viewports?.current?.width ||
                                viewports[closestViewport]?.width,
                        },
                    },
                };
            }
        }
        
        // DEPRECATED
        if (
            Object.keys(initialData?.root || {}).length > 0 &&
            !initialData?.root?.props
        ) {
            console.error(
                "Warning: Defining props on `root` is deprecated. Please use `root.props`, or republish this page to migrate automatically."
            );
        }
        
        // Deprecated
        const rootProps = initialData?.root?.props || initialData?.root || {};
        
        const defaultedRootProps = {
            ...config.root?.defaultProps,
            ...rootProps,
        };
        
        return {
            ...defaultAppState,
            data: {
                ...initialData,
                root: { ...initialData?.root, props: defaultedRootProps },
                content: initialData.content || [],
            },
            ui: {
                ...initial,
                ...clientUiState,
                // Store categories under componentList on state to allow render functions and plugins to modify
                componentList: config.categories
                    ? Object.entries(config.categories).reduce(
                        (acc, [categoryName, category]) => {
                            return {
                                ...acc,
                                [categoryName]: {
                                    title: category.title,
                                    components: category.components,
                                    expanded: category.defaultExpanded,
                                    visible: category.visible,
                                },
                            };
                        },
                        {}
                    )
                    : {},
            },
        } as G["UserAppState"];
    });
    
    const { appendData = true } = _initialHistory || {};
    
    const histories = [
        ...(_initialHistory?.histories || []),
        ...(appendData ? [{ state: generatedAppState }] : []),
    ].map((history) => ({
        ...history,
        // Inject default data to enable partial history injections
        state: { ...generatedAppState, ...history.state },
    }));
    const initialHistoryIndex = _initialHistory?.index || histories.length - 1;
    const initialAppState = histories[initialHistoryIndex].state;
    
    const historyStore = useHistoryStore({
        histories,
        index: initialHistoryIndex,
    });
    
    const [reducer] = useState(() =>
        createReducer<UserConfig, G["UserData"]>({
            config,
            record: historyStore.record,
            onAction,
        })
    );
    
    const [appState, dispatch] = useReducer(
        reducer,
        flushZones<G["UserData"]>(initialAppState) as G["UserAppState"]
    );
    
    const { data, ui } = appState;
    
    const history = usePuckHistory({
        dispatch,
        initialAppState,
        historyStore,
        iframeEnabled: _iframe?.enabled ?? true,
    });
    
    const [menuOpen, setMenuOpen] = useState(false);
    
    const { itemSelector, leftSideBarVisible, rightSideBarVisible } = ui;
    
    const selectedItem = itemSelector ? getItem(itemSelector, data) : null;
    
    useEffect(() => {
        if (onChange) onChange(data as G["UserData"]);
    }, [data]);
    
    const toggleSidebars = useCallback(
        (sidebar: "left" | "right") => {
            const widerViewport = window.matchMedia("(min-width: 638px)").matches;
            const sideBarVisible =
                sidebar === "left" ? leftSideBarVisible : rightSideBarVisible;
            const oppositeSideBar =
                sidebar === "left" ? "rightSideBarVisible" : "leftSideBarVisible";
            
            dispatch({
                type: "setUi",
                ui: {
                    [`${sidebar}SideBarVisible`]: !sideBarVisible,
                    ...(!widerViewport ? { [oppositeSideBar]: false } : {}),
                },
            });
        },
        [dispatch, leftSideBarVisible, rightSideBarVisible]
    );
    
    useEffect(() => {
        if (!window.matchMedia("(min-width: 638px)").matches) {
            dispatch({
                type: "setUi",
                ui: {
                    leftSideBarVisible: false,
                    rightSideBarVisible: false,
                },
            });
        }
        
        const handleResize = () => {
            if (!window.matchMedia("(min-width: 638px)").matches) {
                dispatch({
                    type: "setUi",
                    ui: (ui: UiState) => ({
                        ...ui,
                        ...(ui.rightSideBarVisible ? { leftSideBarVisible: false } : {}),
                    }),
                });
            }
        };
        
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    
    // DEPRECATED
    const defaultHeaderRender = useMemo((): Overrides["header"] => {
        if (renderHeader) {
            console.warn(
                "`renderHeader` is deprecated. Please use `overrides.header` and the `usePuck` hook instead"
            );

            return ({actions, ...props}: any) => {
                const Comp = renderHeader!;
                return (
                    <Comp {...props} dispatch={dispatch} state={appState}>
                        {actions}
                    </Comp>
                );
            };
        }
        
        return DefaultOverride;
    }, [renderHeader]);
    
    // DEPRECATED
    const defaultHeaderActionsRender = useMemo((): Overrides["headerActions"] => {
        if (renderHeaderActions) {
            console.warn(
                "`renderHeaderActions` is deprecated. Please use `overrides.headerActions` and the `usePuck` hook instead."
            );

            return (props: any) => {
                const Comp = renderHeaderActions!;
                return <Comp {...props} dispatch={dispatch} state={appState}></Comp>;
            };
        }
        
        return DefaultOverride;
    }, [renderHeader]);
    
    // Load all plugins into the overrides
    const loadedOverrides = useLoadedOverrides({
        overrides: overrides,
        plugins: plugins,
    });
    
    const CustomPuck = useMemo(
        () => loadedOverrides.puck || DefaultOverride,
        [loadedOverrides]
    );
    
    const CustomHeader = useMemo(
        () => loadedOverrides.header || defaultHeaderRender,
        [loadedOverrides]
    );
    const CustomHeaderActions = useMemo(
        () => loadedOverrides.headerActions || defaultHeaderActionsRender,
        [loadedOverrides]
    );
    
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const selectedComponentConfig =
        selectedItem && config.components[selectedItem.type];
    const selectedComponentLabel = selectedItem
        ? selectedComponentConfig?.["label"] ?? selectedItem.type.toString()
        : "";
    
    usePreviewModeHotkeys(dispatch, iframe.enabled);
    
    return (
        <div className={`Puck ${getClassName()}`}>
            <AppProvider
                value={{
                    state: appState,
                    dispatch,
                    config,
                    plugins: plugins || [],
                    overrides: loadedOverrides,
                    history,
                    viewports,
                    iframe,
                    globalPermissions: {
                        delete: true,
                        drag: true,
                        duplicate: true,
                        insert: true,
                        edit: true,
                        ...permissions,
                    },
                    getPermissions: () => ({}),
                    refreshPermissions: () => null,
                    metadata: metadata || {},
                    // Header-related values
                    headerTitle,
                    headerPath,
                    toggleSidebars,
                    menuOpen,
                    setMenuOpen,
                    CustomHeader,
                    CustomHeaderActions,
                    onPublish,
                    getLayoutClassName,
                    data,
                    appState,
                }}
            >
                {/* Wrap the entire inner area so that any use of <Puck.Header/> gets context */}
                <HeaderContext.Provider
                    value={{
                        headerTitle,
                        headerPath,
                        toggleSidebars,
                        menuOpen,
                        setMenuOpen,
                        CustomHeader,
                        CustomHeaderActions,
                        onPublish,
                        data,
                        dispatch,
                        appState,
                        getLayoutClassName,
                    }}
                >
                    <DragDropContext disableAutoScroll={dnd?.disableAutoScroll}>
                        <CustomPuck>
                            {children || (
                                <div
                                    className={getLayoutClassName({
                                        leftSideBarVisible,
                                        menuOpen,
                                        mounted,
                                        rightSideBarVisible,
                                    })}
                                >
                                    <div className={getLayoutClassName("inner")}>
                                        <Header />
                                        <div className={getLayoutClassName("leftSideBar")}>
                                            <SidebarSection title="Components" noBorderTop>
                                                <Components />
                                            </SidebarSection>
                                            <SidebarSection title="Outline">
                                                <Outline />
                                            </SidebarSection>
                                        </div>
                                        <Canvas />
                                        <div className={getLayoutClassName("rightSideBar")}>
                                            <SidebarSection
                                                noPadding
                                                noBorderTop
                                                showBreadcrumbs
                                                title={
                                                    selectedItem ? selectedComponentLabel : "Page"
                                                }
                                            >
                                                <Fields />
                                            </SidebarSection>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CustomPuck>
                    </DragDropContext>
                </HeaderContext.Provider>
            </AppProvider>
            <div id="puck-portal-root" className={getClassName("portal")} />
        </div>
    );
}

Puck.Components = Components;
Puck.Canvas = Canvas;
Puck.Fields = Fields;
Puck.Outline = Outline;
Puck.Preview = Preview;
Puck.Header = Header;
