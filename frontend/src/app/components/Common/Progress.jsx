import { CircularProgress } from '@material-ui/core';
import './Progress.css';

const Progress = () => {
  return (
    <div className="progressBar">
      <CircularProgress />
    </div>
  );
}

export default Progress;