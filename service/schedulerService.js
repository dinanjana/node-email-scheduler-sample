/**
 * Created by dinanjanag on 4/15/19.
 */
const { QUEUE_COL } = require('../Constants');
import { getAllEmails } from '../repository/db';
const run = async () => {
  const emails = await getAllEmails(QUEUE_COL);

};