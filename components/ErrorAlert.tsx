import React, { FunctionComponent } from 'react';

interface Props {
  errorMessage?: string;
}

const ErrorAlert: FunctionComponent<Props> = ({ errorMessage }) => (
  <div className="h-full relative">
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="bg-red-100 p-5 rounded-lg shadow-lg border border-red-400">
        <p className="text-red-500 font-semibold text-xl">An error has occurred{errorMessage ? ':' : ''}</p>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  </div>
);

export default ErrorAlert;
