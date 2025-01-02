import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";  
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { ButtonType, FormField, Size, Variant } from "../types";

interface FormFieldsButtonProps {
  value: FormField[];
  onChange: (value: FormField[]) => void;
}

const FormFieldsButton: React.FC<FormFieldsButtonProps> = ({
  value = [],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentField, setCurrentField] = useState<FormField>({
    type: "text",
    name: "",
    label: "",
    placeholder: "",
    required: false,
  });

  const fieldTypes = [
    { label: "Text Input", value: "text" },
    { label: "Email", value: "email" },
    { label: "Password", value: "password" },
    { label: "Number", value: "number" },
    { label: "Textarea", value: "textarea" },
    { label: "Select", value: "select" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Radio", value: "radio" },
    { label: "Button", value: "button" },
  ];

  const buttonTypes = [
    { label: "Button", value: "button" },
    { label: "Submit", value: "submit" },
    { label: "Reset", value: "reset" },
  ];

  const buttonVariants = [
    { label: "Default", value: "default" },
    { label: "Destructive", value: "destructive" },
    { label: "Outline", value: "outline" },
    { label: "Secondary", value: "secondary" },
    { label: "Ghost", value: "ghost" },
    { label: "Link", value: "link" },
  ];

  const buttonSizes = [
    { label: "Default", value: "default" },
    { label: "Small", value: "sm" },
    { label: "Large", value: "lg" },
    { label: "Icon", value: "icon" },
  ];

  const handleAdd = () => {
    if (!currentField.name || !currentField.label) {
      return;
    }
    const newFields = [...value, currentField];
    onChange(newFields);
    setCurrentField({
      type: "text",
      name: "",
      label: "",
      placeholder: "",
      required: false,
    });
    setIsOpen(false);
  };

  const handleDelete = (index: number) => {
    const newFields = value.filter((_, i) => i !== index);
    onChange(newFields);
  };

  return (
    <div className="w-full space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Form Field
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Form Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select
                value={currentField.type}
                onValueChange={(type: any) =>
                  setCurrentField({ ...currentField, type })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentField.type === "button" && (
              <>
                <div className="space-y-2">
                  <Label>Button Type</Label>
                  <Select
                    value={currentField.buttonType || "button"}
                    onValueChange={(buttonType: ButtonType) =>
                      setCurrentField({
                        ...currentField,
                        buttonType: buttonType as ButtonType,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button type" />
                    </SelectTrigger>
                    <SelectContent>
                      {buttonTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Button Variant</Label>
                  <Select
                    value={currentField.variant || "default"}
                    onValueChange={(variant: Variant) =>
                      setCurrentField({
                        ...currentField,
                        variant: variant as Variant,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {buttonVariants.map((variant) => (
                        <SelectItem key={variant.value} value={variant.value}>
                          {variant.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Button Size</Label>
                  <Select
                    value={currentField.size || "default"}
                    onValueChange={(size: Size) =>
                      setCurrentField({ ...currentField, size: size as Size })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select button size" />
                    </SelectTrigger>
                    <SelectContent>
                      {buttonSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Field Name</Label>
              <Input
                value={currentField.name}
                onChange={(e: { target: { value: string; }; }) =>
                  setCurrentField({ ...currentField, name: e.target.value })
                }
                placeholder="Enter field name"
              />
            </div>

            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={currentField.label}
                onChange={(e: { target: { value: string; }; }) =>
                  setCurrentField({ ...currentField, label: e.target.value })
                }
                placeholder="Enter field label"
              />
            </div>

            {currentField.type !== "button" && (
              <>
                <div className="space-y-2">
                  <Label>Wrapper Class</Label>
                  <Input
                    value={currentField.wrapperClassName}
                    onChange={(e: { target: { value: string; }; }) =>
                      setCurrentField({
                        ...currentField,
                        wrapperClassName: e.target.value,
                      })
                    }
                    placeholder="Enter wrapper class name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Label Class</Label>
                  <Input
                    value={currentField.labelClassName}
                    onChange={(e: { target: { value: string; }; }) =>
                      setCurrentField({
                        ...currentField,
                        labelClassName: e.target.value,
                      })
                    }
                    placeholder="Enter label class name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Input Class</Label>
                  <Input
                    value={currentField.inputClassName}
                    onChange={(e: { target: { value: string; }; }) =>
                      setCurrentField({
                        ...currentField,
                        inputClassName: e.target.value,
                      })
                    }
                    placeholder="Enter input class name"
                  />
                </div>
              </>
            )}

            {currentField.type === "button" && (
              <div className="space-y-2">
                <Label>Button Class</Label>
                <Input
                  value={currentField.className}
                  onChange={(e: { target: { value: string; }; }) =>
                    setCurrentField({
                      ...currentField,
                      className: e.target.value,
                    })
                  }
                  placeholder="Enter button class name"
                />
              </div>
            )}

            {currentField.type !== "checkbox" &&
              currentField.type !== "button" && (
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    value={currentField.placeholder}
                    onChange={(e: { target: { value: string; }; }) =>
                      setCurrentField({
                        ...currentField,
                        placeholder: e.target.value,
                      })
                    }
                    placeholder="Enter placeholder text"
                  />
                </div>
              )}

            <div className="space-y-2">
              <Label>Required</Label>
              <Select
                value={currentField.required ? "true" : "false"}
                onValueChange={(value: string) =>
                  setCurrentField({
                    ...currentField,
                    required: value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select required status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Optional</SelectItem>
                  <SelectItem value="true">Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleAdd}
              disabled={!currentField.name || !currentField.label}
            >
              Add Field
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {value.map((field, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-secondary/50 rounded-md"
          >
            <span className="text-sm">
              {field.label} ({field.type})
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(index)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormFieldsButton;
