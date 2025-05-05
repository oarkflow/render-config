/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Create a HeaderContext to supply header-related values.
import { createContext, useContext } from "react";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { Button } from "../../../Button";
import { Heading } from "../../../Heading";
import { MenuBar } from "../../../MenuBar";
import { IconButton } from "../../../IconButton";

interface HeaderContextType {
  headerTitle?: string;
  headerPath?: string;
  toggleSidebars: (sidebar: "left" | "right") => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  CustomHeader: React.ElementType;
  CustomHeaderActions: React.ElementType;
  onPublish?: (data: any) => void;
  data: any;
  dispatch: (action: any) => void;
  appState: any;
  getLayoutClassName: (modifier?: string | Record<string, any>) => string;
}

export const HeaderContext = createContext<HeaderContextType | null>(null);

// New separate Header component using our HeaderContext (no props)
export function Header() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    // Fallback: if Header is used outside the provider, render nothing.
    return null;
  }
  const {
    headerTitle,
    headerPath,
    toggleSidebars,
    menuOpen,
    setMenuOpen,
    CustomHeader,
    CustomHeaderActions,
    onPublish,
    data,
    getLayoutClassName,
  } = ctx;
  const rootProps = data.root.props || data.root;
  return (
    <CustomHeader
      actions={
        <>
          <CustomHeaderActions>
            <Button
              onClick={() => {
                onPublish && onPublish(data);
              }}
              icon={<Globe size="14px" />}
            >
              Publish
            </Button>
          </CustomHeaderActions>
        </>
      }
    >
      <header className={getLayoutClassName("header")}>
        <div className={`${getLayoutClassName("headerInner")} !p-2`}>
          <div className={getLayoutClassName("headerToggle")}>
            <div className={getLayoutClassName("leftSideBarToggle")}>
              <IconButton
                onClick={() => toggleSidebars("left")}
                title="Toggle left sidebar"
              >
                <PanelLeft focusable="false" />
              </IconButton>
            </div>
            <div className={getLayoutClassName("rightSideBarToggle")}>
              <IconButton
                onClick={() => toggleSidebars("right")}
                title="Toggle right sidebar"
              >
                <PanelRight focusable="false" />
              </IconButton>
            </div>
          </div>
          <div className={getLayoutClassName("headerTitle")}>
            <Heading rank="2" size="xs">
              {headerTitle || rootProps.title || "Page"}
              {headerPath && (
                <>
                  {" "}
                  <code className={getLayoutClassName("headerPath")}>
                    {headerPath}
                  </code>
                </>
              )}
            </Heading>
          </div>
          <div className={getLayoutClassName("headerTools")}>
            <div className={getLayoutClassName("menuButton")}>
              <IconButton
                onClick={() => setMenuOpen(!menuOpen)}
                title="Toggle menu bar"
              >
                {menuOpen ? (
                  <ChevronUp focusable="false" />
                ) : (
                  <ChevronDown focusable="false" />
                )}
              </IconButton>
            </div>
            <MenuBar
              appState={data}
              dispatch={() => {}}
              onPublish={onPublish}
              menuOpen={menuOpen}
              renderHeaderActions={() => (
                <CustomHeaderActions>
                  <Button
                    onClick={() => {
                      onPublish && onPublish(data);
                    }}
                    icon={<Globe size="14px" />}
                  >
                    Publish
                  </Button>
                </CustomHeaderActions>
              )}
              setMenuOpen={setMenuOpen as any}
            />
          </div>
        </div>
      </header>
    </CustomHeader>
  );
}
