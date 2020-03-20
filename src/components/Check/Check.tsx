import React from "react";
import { CheckCircleOutlined, NotInterestedOutlined } from "@material-ui/icons";

function Check({ ...props }) {
  return props.checked ? (
    <CheckCircleOutlined color="primary" />
  ) : (
    <NotInterestedOutlined color="error" />
  );
}

export default Check;
