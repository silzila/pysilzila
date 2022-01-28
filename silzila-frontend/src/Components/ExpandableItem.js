import { useState } from "react";

export const ExpandableItem = props => {
  const [open, setOpen] = useState(false);

  return props.render({ open, setOpen });
};

export const SelectTableItem = props => {
  const [open, setOpen] = useState(false);

  return props.render({ open, setOpen });
};

// export default ExpandableItem;
