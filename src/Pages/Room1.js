import React from "react";
import Room from "./Room";
import { COLLECTION_ID } from "../appwriteConfig";

const Room1 = () => {
  return (
    <div>
      <Room COLLECTION_ID={COLLECTION_ID} />
    </div>
  );
};

export default Room1;
