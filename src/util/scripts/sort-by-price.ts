/* eslint-disable no-underscore-dangle */
import {
  DataDescEnum, IRetRes, IRetResDesc, IPriceReq,
} from '../../interfaces/interfaces';

export default (data: any[], price: IPriceReq) => {
  const { min, max } = price;
  let allData: any[] = [];
  data.forEach((item: IRetRes) => {
    let retData: any[] = [];
    item.description.forEach((des: IRetResDesc) => {
      const arrKeys: string[] = Object.keys(JSON.parse(JSON.stringify(des)));
      const retObj: IRetResDesc = { _id: '' };
      arrKeys.forEach((str: string | DataDescEnum) => {
        if ((str as DataDescEnum) === 'storage_size' || str === '_id') {
          retObj.storage_size = des.storage_size as string;
          retObj._id = des._id;
        } else if (
          parseInt((des[str as DataDescEnum] as string).slice(1), 10) >= min
          && parseInt((des[str as DataDescEnum] as string).slice(1), 10) <= max
        ) {
          const field = str as DataDescEnum;
          retObj[field] = des[str as DataDescEnum] as string;
        }
      });
      if (Object.keys(retObj).length > 2) retData = [...retData, retObj];
    });
    if (retData.length) {
      item.description = retData;
      allData = [...allData, item];
    }
  });
  return allData;
};
