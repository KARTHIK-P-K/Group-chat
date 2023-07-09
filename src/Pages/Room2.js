import React from "react";
import Room from "./Room";
import { COLLECTION_ID2 } from "../appwriteConfig";
const Room2 = () => {
  return (
    <div>
      <Room COLLECTION_ID={COLLECTION_ID2} />
    </div>
  );
};

export default Room2;
