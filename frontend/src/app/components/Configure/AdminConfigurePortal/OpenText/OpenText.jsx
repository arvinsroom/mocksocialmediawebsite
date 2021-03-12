import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useEffect, useState, Component, createElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';

let pg = 0;

const setPg = () => {
  let prev = pg;
  pg++;
  return prev;
}

const OpenText = () => {
  const [OpenTextArr, setOpenTextArr] = useState([]);
  // const [pg, setPg] = useState(0);
  const [OpenTextQuestions, setOpenTextQuestions] = useState({});
  // const [OpenTextQuestions, setTemplateName] = useState([]);
  const [message, setMessage] = useState("");

  // on first render check if user logged in, verify server
  // useEffect({

  // }, [])

  // const renderPages = ({ OpenTextArr }) => (
  //   <ul>
  //     <li>
  //       <button type="button" onClick={() => OpenTextArr.push({})}>
  //         Add Page
  //       </button>
  //     </li>
  //     {OpenTextArr.map((member, index) => (
  //       <li key={index}>
  //         <button
  //           type="button"
  //           title="Remove Page"
  //           onClick={() => fields.remove(index)}
  //         />
  //         <h4>Page #{index + 1}</h4>
  //         {/* <FieldArray name={`${member}.hobbies`} component={renderHobbies} /> */}
  //         {createElement(renderOpenTextQuestion, { OpenTextArr })}
  //       </li>
  //     ))}
  //   </ul>
  // )



  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 120,
      width: '100%'
    },
  }));

  const classes = useStyles();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    // send the username and password to the server
    // login(username, password).then(
    //   () => {
    //     history.push("/admin/configure");
    //     window.location.reload();
    //   },
    //   (error) => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //     console.log('errorMessage: ', resMessage);
    //     setMessage(resMessage);
    //   }
    // );
    console.log('OpenTextArr: ', OpenTextArr);
  };

  const handleChange = (question, event) => {
    console.log('question Obj: ', question);
    console.log(event.target.value);
    question.question = event.target.value;
  };

  // const createMenuItems = () => {
  //   let menuItems = [];
  //   for (let item in TEMPLATE_TYPES) {
  //     console.log(item);
  //     menuItems.push(<MenuItem value={TEMPLATE_TYPES[item]} key={item}>{item}</MenuItem>)
  //   }
  //   return menuItems;
  // }

  const createMenuItems = () => {
    let menuItems = [];
    console.log('in menu');
    for (let item in OpenTextArr) {
      console.log(item);
      menuItems.push(<p>{'jaksfg'}</p>)
    }
    return menuItems;
  }

  const addPage = async () => {
    // push a new apge object
    console.log('empty page object pushed');
    // push a empty object in OpenTextArr, [[], [], ...]
    const pageObj = [];
    await setOpenTextArr([...OpenTextArr, pageObj]);
  }

  const removePage = async (index) => {
    // push a new apge object
    console.log('remove page object at index: ', index);
    OpenTextArr.splice(index, 1);
    await setOpenTextArr([...OpenTextArr]);
  }

  // pgobj is a single entry in OpenTextArr
  const addQuestion = async (index) => {
    // push a new question object on specific page
    console.log(`question pushed to at page ${index}`);
    let obj = {
    };
    let pushObj = [...OpenTextArr[index], obj];
    let newArr = [...OpenTextArr];
    newArr[index] = pushObj;
    await setOpenTextArr([...newArr]);
  }

  const removeQuestion = (pg, pgIndex, questionIndex) => {
    // push a new question object on specific page
    // console.log(`question pushed to ${pg} at index ${index}`);
    // let obj = {
    //   question: "This is question?",
    //   answer: "This is answer..."
    // };
    // let prevObj = pg[index];
    // prevObj.push(obj);
    // let newArr = [...setOpenTextArr];
    // newArr[index] = prevObj;
    // setOpenTextArr(newArr);
  }

  const updateQuestion = (data, questionObj) => {
    questionObj.question = data.value;
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => addPage()}>
        Add Page
      </button>
      
      {OpenTextArr.map((pg, index) => (
        <li key={index}>
          <button type="button" title="Remove Page" onClick={() => removePage(index)}>
            Remove Page
          </button>
          <h4>Page #{index}</h4>
          {/* on each page we can add multiple questions */}
          <button type="button" onClick={() => addQuestion(index)}>
            Add Quesion
          </button>
          {pg.length > 0 ? pg.map((question, questionIndex) => (
            <li key={questionIndex}>
              {console.log(question)}
              {/* <button type="button" title="Remove Page" onClick={() => removeQuestion(pg, index, questionIndex)}>
                Remove Question
              </button> */}
             <div>
               <span>Add a question</span>
               <input type="text" placeholder={'Please type in question'} onChange={(e) => handleChange(question, e)}/>
             </div>
            </li>
          )): null}
        </li>
      ))}
      <button
        type="submit"
      >
        Save
      </button>
      </form>
   </>
  )
}

export default OpenText;
