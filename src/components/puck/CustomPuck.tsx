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

interface CustomPuckProps {
	dataKey: string;
	handlePreviewClick?: () => void;
	handlePublishClick?: () => void;
	isLoading?: boolean;
}

export const CustomPuck = ({
	dataKey,
	handlePreviewClick,
	handlePublishClick,
	isLoading = false
}: CustomPuckProps) => {
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
					{/* Replace default header with custom one that includes our handlers */}
					{handlePreviewClick && handlePublishClick ? (
						<div className="flex justify-between items-center bg-white p-4 border-b">
							<div>Puck Editor</div>
							<div className="flex gap-2">
								<HeaderActions 
									handlePreviewClick={handlePreviewClick}
									handlePublishClick={handlePublishClick}
									isLoading={isLoading}
								/>
							</div>
						</div>
					) : (
						<Puck.Header/>
					)}
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
	// We could pass these handlers from outside if needed
	const handlePreviewClick = () => {
		console.log("Preview clicked from CustomPuckPage");
	};

	const handlePublishClick = () => {
		console.log("Publish clicked from CustomPuckPage");
	};

	return (
		<>
			<Puck
				config={config as any}
				data={initialData}
				iframe={{
					enabled: false,
				}}
				overrides={{
					headerActions: () => (
						<HeaderActions
							handlePreviewClick={handlePreviewClick}
							handlePublishClick={handlePublishClick}
							isLoading={false}
						/>
					),
					puck: () => <CustomPuck 
						dataKey={"key-1"} 
						handlePreviewClick={handlePreviewClick}
						handlePublishClick={handlePublishClick}
						isLoading={false}
					/>
				}}
			>
			
			</Puck>
		</>
	)
}