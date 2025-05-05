import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function PublishPopup( { open, setOpen }: { open: boolean; setOpen: (open: boolean) => void; }) {

  const [publishMode, setPublishMode] = useState<string | null>(null);
  const [domain, setDomain] = useState("");
  const [slug, setSlug] = useState("");
  const navigate = useNavigate();

  const handleNodeApp = () => {
    navigate("/web/pages");
  };

  const handlePublish = () => {
    if (domain && slug) {
      console.log("Publishing to:", domain, slug);
      navigate(`/webpage/info`);
      // Perform publish action here
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent position={"top-right"} aria-describedby="publish-popup">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              {publishMode && (
                <ArrowLeft
                  className="cursor-pointer text-gray-500 hover:text-gray-800 transition-all duration-200 hover:scale-120"
                  onClick={() => setPublishMode(null)}
                  size={20} // Adjust size if needed
                />
              )}
              <span className="text-lg font-semibold">Choose an Option</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-black/70">
            How would you like to publish this Webpage?
          </p>

          {!publishMode ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold mb-2">Use as NodeApp</h3>
                  <p className="text-black/60 mb-2">
                    Use this webpage as a node in your application{" "}
                  </p>
                </div>
                <Button onClick={() => handleNodeApp()} className="w-full">
                  Use as NodeApp
                </Button>
              </div>
              <div className="rounded-md p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold mb-2">Publish this Page</h3>
                  <p className="text-black/60 mb-2">
                    Publish this Page as a webpage url
                  </p>
                </div>
                <Button
                  onClick={() => setPublishMode("publish")}
                  className="w-full"
                >
                  Publish this Page
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-4 space-y-4">
              <Input
                placeholder="Enter domain name"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <Input
                placeholder="Enter slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Button onClick={handlePublish} className="w-full">
                Submit
              </Button>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
