import React, { useState } from "react";
import { TokenContext } from "../App";
import { BlindMarkingForm } from "../components/BlindMarkingForm";

export const BlindMarkingPage = () => {
  return (
    <div>
      <BlindMarkingForm />
    </div>
  );
};
