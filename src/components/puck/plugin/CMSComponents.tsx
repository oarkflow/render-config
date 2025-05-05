import {Drawer, usePuck} from "@measured/puck";
import {getComponentIcon} from "../utils/componentIcons";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui";

export default function CMSComponents() {
	const {appState} = usePuck();
	// const {appState, dispatch} = usePuck()// 
	const componentList = appState?.ui?.componentList
	
	// const handleClick = (key) => {
	// 	dispatch({
	// 		type: "setUi",
	// 		ui: {
	// 			componentList: {
	// 				...componentList,
	// 				[key]: {
	// 					...componentList?.[key],
	// 					expanded: componentList?.[key]?.expanded === undefined ? false : !componentList?.[key]?.expanded,
	// 				},
	// 			},
	// 		},
	// 	});
	// }
	return (
		<div>
			<Accordion type="multiple" className="w-full" defaultValue={Object.keys(componentList)}>
			{Object.keys(componentList).map((key, i) => {
				return (
					<div key={i}>
						<AccordionItem value={key}>
							<AccordionTrigger className={"py-2"}>{componentList?.[key]?.name ?? key}</AccordionTrigger>
							<AccordionContent>
								<Drawer>
								<div className="grid grid-cols-3 gap-2 py-2">
									{componentList?.[key]?.components?.map((item, index) => {
										return (
											<Drawer.Item key={index} name={item}>
												{() => (
													<div
														key={index}
														className="flex w-full cursor-grab items-center rounded-lg border hover:border-gray-300 bg-white p-2"
													>
														<div
															title={item.toUpperCase()}
															data-pr-tooltip={item.toUpperCase()}
															data-pr-position="right"
															className="node-item text-editor-node-text flex h-10 w-full items-center justify-center rounded-md bg-gray-100"
														>
															{getComponentIcon(item)}
														</div>
													</div>
												)}
											</Drawer.Item>
										);
									})}
								</div>
								</Drawer>
							</AccordionContent>
						</AccordionItem>
					</div>
				);
			})}
			</Accordion>
		</div>
	);
}
