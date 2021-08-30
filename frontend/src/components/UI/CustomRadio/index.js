import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';

const useStyles = makeStyles({
  root: {
    color: "#13c552",
    "&$checked": {
        color: "#13c552"
    }
  },
  checked: {},
});

// Inspired by blueprintjs
export default function CustomRadio(props) {
  const classes = useStyles();

  return (
    <Radio
        classes={{
            root: classes.root,
            checked: classes.checked
        }}
        
        {...props}
    />
  );
}