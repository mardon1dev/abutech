import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import CustomTable from "../components/Table";
import { useAxios } from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { ShareIcon } from "../assets/icons";
import { Input, Select } from "antd";
import ModalWrapper from "../components/ModalWrapper";
import toast, { Toaster } from "react-hot-toast";
import { ContractType, CoursesOfficialType, CustomContract, FileType, SelectTypes } from "../types";


const Contracts = () => {
  const token = localStorage.getItem("access_token");
  const [contracts, setContracts] = useState<CustomContract[]>([]);

  const [openModal, setModalOpen] = useState<boolean>(false);

  const [courses, setCourses] = useState<SelectTypes[]>([]);

  const [file, setFile] = useState<FileType | null>();
  const [courseName, setCourseName] = useState<string>("");
  const [courseId, setCourseId] = useState<number>(1);

  const [searchValue, setSearchValue] = useState("");

  async function fetchData() {
    try {
      const response = await useAxios().get("/contracts/all", {
        params: {
          search: searchValue,
        },
      });
      setContracts(
        response.data.data.contracts.map((contract: ContractType) => {
          return {
            id: contract.id,
            title: contract.title,
            fileName: contract.attachment?.origName,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }
  async function getCourses() {
    try {
      const response = await useAxios().get("/courses", {
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
      toast.error("Kurslarni topa olmadi.");
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [searchValue]);

  useEffect(() => {
    getCourses();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await useAxios().post(
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
      if (response.status === 200) {
        toast.success("Shartnoma muaffaqqiyatli yuklandi.");
        const uploadFile = response?.data?.data[0];
        const newData = {
          courseId: Number(courseId),
          title: courseName,
          attachment: {
            origName: uploadFile?.fileName,
            size: uploadFile?.size,
            url: uploadFile?.path,
          },
        };
        try {
          const response = await useAxios().post("/contracts/create", newData);
          if (response.status === 200) {
            toast.success("Shartnoma muaffaqiyatli qo'shildi.");
            handleClear();
            fetchData();
          }
        } catch (error) {
          toast.error("Ma'lumot takrorlangan.");
          console.error(error);
        }
      }
    } catch (error) {
      toast.error("Contract upload failed");
      console.error(error);
    }
  }

  function handleClear() {
    setCourseName("");
    setCourseId(1);
    setFile(null);
    setModalOpen(false);
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full h-screen p-6">
        <div className=" h-full border border-[#EDEDED] rounded-xl relative overflow-y-scroll">
          <div className="w-full bg-[#FBFBFB] p-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-[10px]">
              <SearchOutlined className="text-[#667085] w-[21px] h-[21px]" />
              <input
                type="text"
                placeholder="Qidiruv"
                value={searchValue}
                onChange={(e) =>
                  setSearchValue(e.target.value.toLowerCase().trim())
                }
                className="max-w-[400px] min-w-[100px] outline-none rounded-lg bg-transparent placeholder:text-[#667085] text-[#000] text-lg font-normal leading-7 "
              />
            </div>
            <button
              className="bg-[#0EB182] hover:bg-[#0EB182]/80 text-white text-base font-normal leading-6 py-[10px] px-[20px] rounded-[10px]"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Qo'shish
            </button>
          </div>
          <CustomTable data={contracts} fetchData={fetchData} />
        </div>
      </div>
      <ModalWrapper
        mode="update"
        openModal={openModal}
        title="Shartnoma yaratish"
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
                  {file.name}
                </p>
                <button
                  type="button"
                  className="absolute right-4 rounded bg-gray-200"
                  onClick={() => {
                    setFile(null);
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
                      setFile(files[0]);
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
              Saqlash
            </button>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default Contracts;
