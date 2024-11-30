import React, { FormEvent, useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { Input, Select, Table } from "antd";
import { useAxios } from "../hooks/useAxios";
import ModalWrapper from "./ModalWrapper";
import { ShareIcon } from "../assets/icons";
import toast, { Toaster } from "react-hot-toast";
import {
  AttachmentType,
  ContractType,
  CoursesOfficialType,
  CustomContract,
  SelectTypes,
  TableTypes,
} from "../types";

const CustomTable: React.FC<TableTypes> = ({ data, fetchData }) => {
  const token = localStorage.getItem("access_token");

  const [openModal, setOpenModal] = useState<boolean>(false);

  const axiosInstance = useAxios();
  const [singleContract, setSingleContract] = useState<ContractType | null>({});

  const [file, setFile] = useState<AttachmentType | undefined>(undefined);

  const [courseName, setCourseName] = useState<string>();
  const [courseId, setCourseId] = useState<number | undefined>(1);
  const [courses, setCourses] = useState<SelectTypes[]>([]);

  async function getSingleContract(id: number | undefined) {
    try {
      const response = await axiosInstance.get(`/contracts/${id}`);
      setSingleContract(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCourses() {
    try {
      const response = await axiosInstance.get("/courses", {
        params: {
          page: 1,
          limit: 100,
        },
      });
      setCourses(
        response?.data?.data?.courses.map((course: CoursesOfficialType) => {
          return {
            value: String(course.id),
            label: course.name,
          };
        })
      );
    } catch (error) {
      toast.error("Kurslarni olishda xato.");
      console.error(error);
    }
  }

  const handleShowSingleData = (id: number | undefined) => {
    setOpenModal(true);
    getSingleContract(id);
    getCourses();
  };

  useEffect(() => {
    setCourseName(singleContract?.title);
    setCourseId(singleContract?.course?.id);
    setFile(singleContract?.attachment);
  }, [singleContract]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      let updatedFile = file;
      if (!file?.url) {
        const uploadResponse = await useAxios().post(
          "/upload/contract/attachment",
          {
            files: file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (uploadResponse.status === 200) {
          toast.success("Faylni muaffaqqiyatli qo'shildi.");
          const uploadedFileData = uploadResponse?.data?.data[0];
          updatedFile = {
            origName: uploadedFileData.fileName,
            size: uploadedFileData.size,
            url: uploadedFileData.path,
          };

          const newData = {
            title: courseName,
            courseId: courseId,
            attachment: updatedFile,
          };

          try {
            const response = await axiosInstance.put(
              `/contracts/${singleContract?.id}`,
              newData
            );

            if (response.status === 200) {
              toast.success("Shartnoma muaffaqiyatli o'zgartirildi.");
              handleClear();
              fetchData();
            }
          } catch (error) {
            toast.error("Takrorlangan ma'lumot.");
            console.error(error);
          }
        }
      } else {
        const newData = {
          title: courseName,
          courseId: courseId,
          attachment: updatedFile,
        };
        try {
          const response = await axiosInstance.put(
            `/contracts/${singleContract?.id}`,
            newData
          );

          if (response.status === 200) {
            toast.success("Shartnoma muaffaqiyatli o'zgartirildi.");
            handleClear();
            fetchData();
          }
        } catch (error) {
          toast.error("Takrorlangan ma'lumot.");
          console.error(error);
        }
      }
    } catch (error) {
      console.error("Error updating contract:", error);
      toast.error("Shartnoma o'zgartirishda xato.");
    }
  }

  const handleClear = () => {
    setSingleContract(null);
    setCourseName("");
    setCourseId(1);
    setFile(undefined);
    setOpenModal(false);
  };

  const columns: TableColumnsType<CustomContract> = [
    {
      title: "#",
      dataIndex: "id",
    },
    {
      title: "Nomi",
      dataIndex: "fileName",
      render: (_, record) => <div className="md:w-[400px]">{record.fileName}</div>,
    },
    {
      title: "Kurs",
      dataIndex: "title",
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <div>
          <button
            className="cursor-pointer"
            onClick={() => handleShowSingleData(record?.id)}
          >
            <MoreOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Table<CustomContract>
        columns={columns}
        dataSource={data}
        rowKey={(record) => Number(record.id)}
      />

      <ModalWrapper
        mode="update"
        openModal={openModal}
        title="Shartnoma tahrirlash"
        onClose={() => handleClear()}
      >
        <form
          className="w-full mt-8"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col">
            <label className="form-label mb-2">Kurs</label>
            <Select
              showSearch
              placeholder="Tanlang"
              options={courses.map((course: SelectTypes) => ({
                value: course.value,
                label: course.label,
              }))}
              className="text-black required"
              size="large"
              value={String(courseId)}
              onChange={(label) => {
                setCourseId(Number(label));
              }}
            />
          </div>
          <div className="mt-8">
            <label className="form-label">Nomi</label>
            <Input
              type="text"
              placeholder="Nomi"
              size="large"
              className="mt-2 text-black"
              required
              value={courseName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCourseName(e.target.value);
              }}
            />
          </div>
          <div className="w-full mt-8 py-3 flex items-center justify-center border-dashed border rounded-lg hover:bg-gray-100 duration-100">
            {file ? (
              <div className=" w-full flex relative items-center justify-center">
                <p className="gap-4 text-[#0EB182] text-center flex items-center">
                  <ShareIcon />
                  {file?.origName || file?.name}
                </p>
                <button
                  type="button"
                  className="absolute right-4 rounded bg-gray-200"
                  onClick={() => {
                    setFile(undefined);
                  }}
                >
                  <DeleteOutlined className="text-[#FC7857] p-[6px]" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <ShareIcon />
                  <span className="text-[#0EB182]">Fayl biriktiring</span>
                </div>
                <Input
                  type="file"
                  style={{
                    display: "none",
                  }}
                  accept=".docx"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const selectedFile = files[0];
                      setFile(selectedFile);
                    }
                  }}
                />
              </label>
            )}
          </div>
          <div className="mt-8 flex items-center justify-end gap-[20px]">
            <button
              type="button"
              className="border border-[#E3E3E3] rounded-lg text-[#667085] py-2 px-3 hover:bg-gray-100"
              onClick={() => handleClear()}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="text-white bg-[#0EB182] rounded-lg py-2 px-3 border border-[#0eb182] hover:bg-[#0eb182]/80"
            >
              Tahrirlash
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};

export default CustomTable;
