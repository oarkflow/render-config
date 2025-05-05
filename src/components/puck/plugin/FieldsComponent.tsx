/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import React from 'react';

const FieldsComponent = ({ children }: { children: React.ReactNode }) => {
  // const [activeTab, setActiveTab] = useState("styles");

  const styleChildren: React.ReactNode[] = [];
  const dataChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child: any) => {
    const propsName = child?.props?.children?.props;

    if (
      propsName &&
      (propsName?.name?.toLowerCase() === 'content' ||
        propsName.name?.toLowerCase() === 'items' ||
        propsName.name?.toLowerCase() === 'name' ||
        propsName.name?.toLowerCase() === 'tabledata')
    ) {
      dataChildren.push(child);
    } else {
      styleChildren.push(child);
    }
  });

  return (
    <Tabs defaultValue="ui" className="w-full">
      <TabsList className="grid w-full grid-cols-2 px-2">
        <TabsTrigger value="ui">UI</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
      </TabsList>
      <TabsContent value="ui">
        <div className={'px-4'}>
          <h3 className="text-lg font-semibold mb-4  border-b /20 pb-2">Styles</h3>
          <div className="space-y-4">{styleChildren}</div>
        </div>
      </TabsContent>
      <TabsContent value="data">
        <div className={'px-4'}>
          <h3 className="text-lg font-semibold mb-4  border-b /20 pb-2">Data</h3>
          <div className="space-y-4">{dataChildren}</div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FieldsComponent;
