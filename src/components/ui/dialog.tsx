import * as DialogPrimitive from "@radix-ui/react-dialog";
import {DialogDescriptionProps} from "@radix-ui/react-dialog";
import {XIcon} from "lucide-react";
import * as React from "react";

import {cn} from "@/lib/utils";

const Dialog = ({
	                ...props
                }: React.ComponentProps<typeof DialogPrimitive.Root>) => {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

const DialogTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof DialogPrimitive.Trigger>
>(({...props}, ref) => {
	return (
		<DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />
	);
});

const DialogPortal = ({
	                      ...props
                      }: React.ComponentProps<typeof DialogPrimitive.Portal>) => {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

const DialogClose = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof DialogPrimitive.Close>
>(({...props}, ref) => {
	return (
		<DialogPrimitive.Close ref={ref} data-slot="dialog-close" {...props} />
	);
});

const DialogOverlay = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay> & {
	backdrop?: boolean;
}
>(({className, backdrop = true, ...props}, ref) => {
	return (
		<DialogPrimitive.Overlay
			ref={ref}
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/10",
				backdrop ? "backdrop-blur-sm" : "",
				className
			)}
			{...props} // ✅ Ensure backdrop is NOT spread into DialogPrimitive.Overlay
		/>
	);
});

const DialogContent = ({
	                       className,
	                       children,
	                       backdrop = true,
	                       showClose = true,
	                       position = "center",
	                       ...props
                       }: React.ComponentProps<typeof DialogPrimitive.Content> & {
	backdrop?: boolean;
	showClose?: boolean;
	position?:
		| "center"
		| "top-left"
		| "top-center"
		| "top-right"
		| "bottom-left"
		| "bottom-center"
		| "bottom-right";
}) => {
	const positionClasses: Record<NonNullable<typeof position>, string> = {
		center: "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
		"top-left": "top-8 left-8",
		"top-center": "top-8 left-[50%] translate-x-[-50%]",
		"top-right": "top-8 right-8",
		"bottom-left": "bottom-8 left-8",
		"bottom-center": "bottom-8 left-[50%] translate-x-[-50%]",
		"bottom-right": "bottom-8 right-8",
	};
	
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay backdrop={backdrop}/>
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
					positionClasses[position],
					className
				)}
				{...props}
			>
				{children}
				{showClose && (
					<DialogPrimitive.Close
						className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
						<XIcon/>
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
};

const DialogHeader = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({className, ...props}, ref) => {
	return (
		<div
			ref={ref}
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
});

const DialogFooter = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({className, ...props}, ref) => {
	return (
		<div
			ref={ref}
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className
			)}
			{...props}
		/>
	);
});

const DialogTitle = React.forwardRef<
	HTMLHeadingElement,
	React.ComponentProps<typeof DialogPrimitive.Title>
>(({className, ...props}, ref) => {
	return (
		<DialogPrimitive.Title
			ref={ref}
			data-slot="dialog-title"
			className={cn(
				"text-lg leading-none font-semibold tracking-tight",
				className
			)}
			{...props}
		/>
	);
});

const DialogDescription = React.forwardRef<
	HTMLParagraphElement,
	DialogDescriptionProps
>(
	(
		{
			className,
			...props
		}: React.ComponentProps<typeof DialogPrimitive.Description>,
		ref
	) => {
		return (
			<DialogPrimitive.Description
				ref={ref}
				data-slot="dialog-description"
				className={cn("text-muted-foreground text-sm", className)}
				{...props}
			/>
		);
	}
);

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
