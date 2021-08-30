import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';

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
export default function CustomCheckbox(props) {
  const classes = useStyles();

  return (
    <Checkbox
        classes={{
            root: classes.root,
            checked: classes.checked
        }}
        checkedIcon={<CheckCircleIcon />}
        icon={<PanoramaFishEyeIcon />}
        {...props}
    />
  );
}