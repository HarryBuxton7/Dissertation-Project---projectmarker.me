import React, { useContext } from 'react';
import { UploadPaperForm } from '../components/UploadPaperForm';
import { TokenContext } from '../App';


export const UploadPage = () => {

  return (
    <div>
      <UploadPaperForm />
    </div>
  );
};
