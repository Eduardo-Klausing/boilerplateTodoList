import React from 'react';
import { Switch, SwitchProps, FormControlLabel } from '@mui/material';

interface SimpleFormSwitchProps extends SwitchProps {
  label?: string;
}

const SimpleFormSwitch: React.FC<SimpleFormSwitchProps> = ({ label, ...props }) => {
  if (label) {
    return (
      <FormControlLabel
        control={<Switch {...props} />}
        label={label}
      />
    );
  }
  return <Switch {...props} />;
};

export default SimpleFormSwitch;