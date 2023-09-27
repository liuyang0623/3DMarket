import request from "@/utils/http/request";

enum API {
  UploadFile = "/note/ugcresource/admin/oss/upload_file",
}

export const uploadFile = (params: any) => {
  return request.post(API.UploadFile, params);
};
