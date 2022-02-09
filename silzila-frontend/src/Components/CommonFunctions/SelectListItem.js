import { useState } from "react";

export const SelectListItem = (props) => {
    const [open, setOpen] = useState(false);

    return props.render({ open, setOpen });
};
