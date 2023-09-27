import service from "@/utils/request";

enum Api {
  Upload = "/note/ugcresource/admin/oss/upload_file",
}

const uploadFile = (params: any) => {
  return service.post(Api.Upload, params);
};

export { uploadFile };
