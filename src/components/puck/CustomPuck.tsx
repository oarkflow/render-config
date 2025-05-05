/* eslint-disable @typescript-eslint/no-explicit-any */
import {Puck, usePuck} from "@/packages/measured/puck";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui";
import HeaderActions from "@/components/puck/plugin/HeaderActions";

const config = {
	components: {
		HeadingBlock: {
			fields: {
				children: {
					type: "text",
				},
			},
			render: ({ children }:{children:any}) => {
				return <h1>{!children && <>&nbsp;</>}{children}</h1>;
			},
		},
	},
};

const initialData = {};


export const CustomPuck = ({dataKey}:{dataKey:string}) => {
	const {appState} = usePuck()
	const { leftSideBarVisible, rightSideBarVisible } = appState.ui;
	return (
		<>
			<div className="flex" key={dataKey}>
				{leftSideBarVisible && (
					<div className="w-84 p-2">
						<Tabs defaultValue="components" className="w-full">
							<TabsList className="grid w-full grid-cols-2 px-2">
								<TabsTrigger value="components">Components</TabsTrigger>
								<TabsTrigger value="outline">Outline</TabsTrigger>
							</TabsList>
							<TabsContent value="components">
								<Puck.Components/>
							</TabsContent>
							<TabsContent value="outline">
								<Puck.Outline/>
							</TabsContent>
						</Tabs>
					</div>
				)}
				<div className="flex-1 flex-grow px-2 border-x">
					<Puck.Header/>
					<div className=" h-[calc(100svh-60px)] bg-slate-100">
						<Puck.Canvas/>
					</div>
				</div>
				{rightSideBarVisible && (
					<div className="lg:w-84 p-2">
						<Puck.Fields/>
					</div>
				)}
			</div>
		</>
	)
}

export const CustomPuckPage = () => {
	return (
		<>
			<Puck
				config={config as any}
				data={initialData}
				iframe={{
					enabled: false,
				}}
				overrides={{
					headerActions: HeaderActions,
					puck: () => <CustomPuck dataKey={"key-1"}/>
				}}
			>
			
			</Puck>
		</>
	)
}