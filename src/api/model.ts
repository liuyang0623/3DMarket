import service from "@/utils/request";

enum Api {
  GetModelCategory = "/note/library/to/c/model/category/get/by/pid",
  GetModelList = "/note/library/to/c/model/list",
  GetModelDetail = "/note/library/to/c/get/model/by/id",
  AddSingleModel = "/note/library/admin/model/add",
  UpdateSingleModel = "/note/library/admin/model/update",
  DelModel = "/note/library/admin/model/delete",
  GetLikeList = "/note/library/to/c/get/models/by/categoryIds",
  AddViewNum = "/note/library/to/c/add/view/num/by/id",
  ChangeLike = "/note/library/to/c/like/model/by/id",
  AddModelCollection = "/note/library/to/c/model/list/add",
  UpdateModelCollection = "/note/library/to/c/model/list/update",
  DelModelCollection = "/note/library/to/c/model/list/delete",
  GetCollectionModelList = "/note/library/to/c/get/models/by/model_list_id"
}

interface GetModelListParamsI {
  order_by_type?: number;
  time_type?: number;
  category_id?: number;
  if_collection?: number;
  if_function?: number;
  get_type?: number;
  name?: string;
  list_type?: number;
  user_id?: string;
  page_size: number;
  page_number: number;
}
const getModelList = (params: GetModelListParamsI) => {
  return service.get(Api.GetModelList, params);
};

interface GetModelCategoryParamsI {
  pid: number | string;
}
const getModelCategory = (params: GetModelCategoryParamsI) => {
  return service.get(Api.GetModelCategory, params);
};

interface GetModelDetailPropsI {
  model_id: number | string;
}
const getModelDetail = (params: GetModelDetailPropsI) => {
  return service.get(Api.GetModelDetail, params);
};

const addSingleModel = (params: any) => {
  return service.post(Api.AddSingleModel, params);
};
const updateSingleModel = (params: any) => {
  return service.post(Api.UpdateSingleModel, params);
};

interface DelModelParamsI {
  id: string;
}
const delModel = (params: DelModelParamsI) => {
  return service.get(Api.DelModel, params);
};

const addModelCollection = (params: any) => {
  return service.post(Api.AddModelCollection, params);
};
const updateModelCollection = (params: any) => {
  return service.post(Api.UpdateModelCollection, params);
};
interface DelModelCollectionParamsI {
  id: string;
}
const delModelCollection = (params: DelModelCollectionParamsI) => {
  return service.get(Api.DelModelCollection, params);
};

interface GetCollectionModelListParamsI {
  model_list_id: string | number
}
const getModelCollectionList = (params: GetCollectionModelListParamsI) => {
  return service.get(Api.GetCollectionModelList, params);
};

interface GetLikeListParamsI {
  category_ids: string | Array<any>;
  page_size: number;
  page_number: number;
}
const getLikeList = (params: GetLikeListParamsI) => {
  return service.get(Api.GetLikeList, params);
};

interface AddViewNumParamsI {
  model_id: string | number;
}
const addViewNum = (params: AddViewNumParamsI) => {
  return service.get(Api.AddViewNum, params);
};

interface ChangeLikeParamsI {
  model_id: string | number;
  opt: 1 | 2;
}
const changeLike = (params: ChangeLikeParamsI) => {
  return service.get(Api.ChangeLike, params);
};
export {
  getModelList,
  getModelCategory,
  getModelDetail,
  addSingleModel,
  updateSingleModel,
  delModel,
  addModelCollection,
  updateModelCollection,
  delModelCollection,
  getLikeList,
  addViewNum,
  changeLike,
  getModelCollectionList,
};
