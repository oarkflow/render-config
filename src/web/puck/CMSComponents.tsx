import { usePuck, Drawer } from "../../packages/measured/puck";

export default function CMSComponents() {
  const { appState, dispatch } = usePuck();
  let CIndex = -1;

  const getIndex = () => {
    CIndex++;
    return CIndex;
  };
  return (
    <div className="mr-4">
      {Object.keys(appState?.ui?.componentList).map((key, i) => {
        return (
          <div key={i}>
            <div className={`w-full rounded-[10px] mb-5  mx-2 `}>
              <div
                onClick={() => {
                  dispatch({
                    type: "setUi",
                    ui: {
                      componentList: {
                        ...appState?.ui?.componentList,
                        [key]: {
                          ...appState?.ui?.componentList?.[key],
                          expanded:
                            appState?.ui?.componentList?.[key]?.expanded ===
                            undefined
                              ? false
                              : !appState?.ui?.componentList?.[key]?.expanded,
                        },
                      },
                    },
                  });
                }}
                className={`flex w-full bg-[#d6f9ff] cursor-pointer ${
                  appState?.ui?.componentList?.[key]?.expanded === undefined ||
                  appState?.ui?.componentList?.[key]?.expanded
                    ? "rounded-bl-0 rounded-br-0 rounded-tl-[10px] rounded-tr-[10px]"
                    : "rounded-[10px]"
                }  border border-[#005f73]    p-3`}
              >
                {" "}
                <div className="text-sm font-semibold tracking-wide capitalize font-muli cms_text_color">
                  {" "}
                  {key}
                </div>
                <div className="flex items-center justify-end w-full px-1">
                  {appState?.ui?.componentList?.[key]?.expanded === undefined ||
                  appState?.ui?.componentList?.[key]?.expanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 lucide lucide-chevron-up "
                    >
                      <path d="m18 15-6-6-6 6"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 lucide lucide-chevron-down"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  )}{" "}
                </div>
              </div>
              {/* Drawer component */}
              {appState?.ui?.componentList?.[key]?.expanded === undefined ||
              appState?.ui?.componentList?.[key]?.expanded ? (
                <Drawer>
                  <div className="grid grid-cols-2 grid-flow-row gap-2.5  p-3 border cursor-auto  w-full  bg-white  rounded-bl-[10px] rounded-br-[10px] rounded-tl-0 rounded-tr-0 ">
                    {appState?.ui?.componentList?.[key]?.components?.map(
                      (item) => {
                        const cI = getIndex();
                        return (
                          <Drawer.Item index={cI} key={cI} name={item}>
                            {() => <span key={cI}>{item}</span>}
                          </Drawer.Item>
                        );
                      }
                    )}
                  </div>
                </Drawer>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
