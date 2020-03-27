import React from "react";
import { observer } from "mobx-react-lite";
import ICSSProperty from "interfaces/ICSSProperty";
import { TABS_HEIGHT } from "models/Constants";
import CSSProperty from "views/Editor/components/tabs/CSSProperty";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import { PROPERTY_EXPANDED } from "models/Control/CSSProperty";

interface CSSPropertiesProps {
  properties: ICSSProperty[];
  dictionary: EditorDictionary;
}

const CSSProperties: React.FC<CSSPropertiesProps> = ({properties, dictionary}) => {
  const hasToShow = (prop: ICSSProperty) => {
    if(prop.showWhen) {
      const property = properties.find(p => p.key === prop.showWhen![0]);
      if(property) {
        if(prop.showWhen[1] === PROPERTY_EXPANDED && property.expanded) {
          return true;
        }
        if(prop.showWhen[1] === property.value) {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  return (
    <div style={{height: `calc(100% - ${TABS_HEIGHT}px)`, overflow: "auto"}}>
      {
        properties.map((prop, i) => {
          return hasToShow(prop) ? <CSSProperty key={i.toString()} prop={prop} dictionary={dictionary} /> : null;
        })
      }
      </div>
  )
};

export default observer(CSSProperties);
