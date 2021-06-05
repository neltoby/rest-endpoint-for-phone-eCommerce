import {
  IDataCollected,
  IRetVal,
  IDataDescription,
  DataDescEnum,
} from '../../interfaces/interfaces';

export default function dataAdapter(data: IDataCollected[]) {
  let retArr: IRetVal[] = [];
  data.forEach((item: IDataCollected) => {
    item.description.forEach((des: IDataDescription) => {
      const objKeys = Object.keys(JSON.parse(JSON.stringify(des)));
      objKeys.forEach((val: string | DataDescEnum) => {
        if (val !== 'storage_size' && val !== '_id') {
          const objArr: IRetVal = {
            phone_name: item.phone_name,
            category: item.category,
            // eslint-disable-next-line dot-notation
            storage: des['storage_size'],
            condition: '',
            price: '',
          };
          objArr.condition = val;
          objArr.price = des[val as DataDescEnum];
          retArr = [...retArr, objArr];
        }
      });
    });
  });
  return retArr;
}
