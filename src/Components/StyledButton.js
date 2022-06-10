import React from "react";
import classNames from "classnames";

function StyledButton(props) {
  let propDerivedClasses = props.className;
  switch (props.role) {
    case "danger":
      propDerivedClasses = classNames(
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        propDerivedClasses
      );
      break;
    case "primary":
    default:
      propDerivedClasses = classNames(
        "hover:bg-gray-100 text-gray-700 focus:ring-indigo-500",
        propDerivedClasses
      );
  }
  return (
    <button
      type="button"
      className={classNames(
        "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
        propDerivedClasses
      )}
      onClick={props.onClick}
      {...props.options}
    >
      {props.children}
    </button>
  );
}

export default StyledButton;