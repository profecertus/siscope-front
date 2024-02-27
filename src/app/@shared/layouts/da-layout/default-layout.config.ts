import { DaLayoutConfig } from "./da-layout.type";

export const DEFAULT_LAYOUT_CONFIG: DaLayoutConfig = {
  id:"topNav",
  mode:"headerTop",
  header:{
    fixed:true,
    firHeader:{
      height:60
    },
    secHeader:{
      hidden:true
    }
  },
  sidebar:{
    hidden:true,
    shrink:true
  },
  footer:{
    hidden:false
  }
};
