import { Posting } from './posting';

export class Journal {
  id: string;
  transaction_date: string;
  note: string;
  ref_number: string;
  postings: Posting[];

  constructor(
    transaction_date: string = '',
    note: string = '',
    ref_number: string = '',
    postings: Posting[] = []
  ) {
    this.transaction_date = transaction_date;
    this.note = note;
    this.ref_number = ref_number;
    this.postings = postings;
  }
}
