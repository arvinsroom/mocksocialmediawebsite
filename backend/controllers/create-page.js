import db from "../clients/database-client";
import { shuffle } from '../utils';
const Page = db.Page;

const pageCreate = async (pageObj, transaction) => {
  if (!pageObj.templateId) {
    throw "Template Id is required!";
  }
  if (!pageObj.name) {
    throw "Page name is required!";
  }
  if (!pageObj.type) {
    throw "Page type is required!";
  }
  
  try {
    const data = await Page.create(pageObj, { transaction });
    return data._id;
  } catch (error) {
    console.log(error.message);
    throw error.message || "Some error occurred while creating the Page record."
  }
};

// get page data using pageId
const findOne = (req, res) => {
  const _id = req.params._id;

  Page.findByPk(_id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Page with id=" + _id
      });
    });
};

const randomizeSamePages = (pages, pagesLength) => {
  try {
    let newPages = [];
    let prevOrder = pages[0].flowOrder;
    for (let i = 1; i < pagesLength;) {
      let currOrder = pages[i].flowOrder;
      if (currOrder !== prevOrder) { // we assume they are already in increasing order
        // add prev to newPages and make prev the current
        newPages = newPages.concat(pages.slice(i-1, i));
        prevOrder = currOrder;
        i++;
        continue;
      }
      // if currOrder is same as prevOrder
      // start checking till be find something not equal
      // and untill then sort them
      let prevOrderIndex = i-1;
      let j = i+1;
      while (j < pagesLength && pages[j].flowOrder === currOrder) {
        j++;
      }
      // check edge case if everything was same till the end
      if (j >= pagesLength) {
        // randomize the whole array and append it to the new Pages
        newPages = newPages.concat(shuffle(pages.slice(prevOrderIndex)));
        break;
      } else {
        // we would be still going on further in our array
        newPages = newPages.concat(shuffle(pages.slice(prevOrderIndex, j)));
        // set current as prevOrder (j+1) as we will be going on to the next iteration right away
        prevOrder = pages[j].flowOrder;
        // forward i to j+1
        i = j + 1;
      }
    }
    // we have to append the remaining item(s)
    newPages = newPages.concat(pages.slice(newPages.length));
    return newPages;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get all pages (flow) data using template Id
// have 
const findAllPages = async (templateId, transaction) => {
  try {
    const pages = await Page.findAll({
      where: {
        templateId
      },
      order: [
        ['flowOrder', 'ASC']
      ]
    }, { transaction });

    const pagesLength = pages.length;
    // if two posts ID are same then using random numbers switch them
    // order is a number from 0 to 65535
    if (pages <= 1) return pages;
    else {
      try {
        return randomizeSamePages(pages, pagesLength);
      } catch (error) {
        console.log(`Some error occured while randomizing these ${pages}.`, error);
        console.log(`Returning original pages ${pages} as it in ASC from sequelize!.`);
        return pages;
      }
    }
  } catch (error) {
    throw error;
  }
};

export default {
  findOne,
  pageCreate,
  findAllPages
}