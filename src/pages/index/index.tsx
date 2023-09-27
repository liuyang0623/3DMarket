import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Filter from "@/components/common/filter/Filter";
import ModelCard from "@/components/common/modelCard/ModelCard";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchModelList } from "@/store/modules/model";
import { setGlobalLoading } from "@/store/modules/utils";
import "./index.scss";

export default function Index() {
  const { t } = useTranslation();
  const { modelList, params, hasMore } = useAppSelector((state) => state.model);
  const dispatch = useAppDispatch();
  const changeSortFilter = useCallback(
    async (query: any) => {
      dispatch(setGlobalLoading({ title: "加载中...", show: true }));
      await dispatch(
        fetchModelList({
          page_number: 0,
          page_size: 30,
          filter: {
            ...params,
            ...query,
          },
        })
      );
      dispatch(setGlobalLoading({ title: "加载中...", show: false }));
    },
    [dispatch, params]
  );
  const [pageNumber, setPageNumber] = useState(0);
  useEffect(() => {
    if (pageNumber > 0) {
      dispatch(
        fetchModelList({
          page_number: pageNumber,
          page_size: 30,
          filter: params,
          type: "turn",
        })
      );
    }
  }, [pageNumber, dispatch, params]);

  // useEffect(() => {
  //   dispatch(fetchModelList({ page_number: 0, page_size: 30 }));
  // }, [dispatch]);
  return (
    <div className="page index">
      <Filter changeSortFilter={changeSortFilter} />
      {modelList.length ? (
        <div className="content">
          <div className="content-list">
            {modelList.map((v: any) => {
              return (
                <div className="card_wrap" key={v.id}>
                  <ModelCard data={v} type="list" />
                </div>
              );
            })}
          </div>
          {hasMore && (
            <button
              className="load-more_btn"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              {t("model.loadMore")}
            </button>
          )}
        </div>
      ) : (
        <div className="content empty empty-style">
          <img
            src={require("../../assets/images/empty.png")}
            className="empty-img"
            alt=""
          />
          <div className="text_wrap">
            <p className="title text">{t("prompt.empty")}</p>
            <p className="desc text">{t("prompt.emptyText")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
