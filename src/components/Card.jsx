import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { UserContext } from "../App";
import AuthApiService from "../services/auth-api-service";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export default function Card() {
  const context = useContext(UserContext);
  const userLogs = context.fishingLogsData;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  async function handleDelete(fish_id) {
    if (
      window.confirm(
        "Are you sure you want to delete this log? This cannot be undone."
      )
    ) {
      return await AuthApiService.deleteItem(fish_id, "fishing_logs").then(
        window.location.reload()
      );
    }
  }

  function fishImage(filename) {
    const image = `https://fishing-journal.s3.amazonaws.com/${filename}`;
    if (filename === null) {
      return (
        <div className="relative h-72 w-full sm:w-80 md:w-96 shadow-md mx-auto bg-zinc-300"></div>
      );
    } else {
      return (
        <div className="relative h-72 w-full sm:w-80 md:w-96 mx-auto bg-zinc-300">
        <img
          src={image}
          alt=""
          className="relative w-full sm:w-80 md:w-96 mx-auto"
        ></img>
        </div>
      );
    }
  }

  return userLogs.map((info, id) => {
    const {
      fish_id,
      species,
      fish_length,
      pounds,
      ounces,
      bait,
      fishing_method,
      filename,
    } = info;

    return (
      <div key={id} className="block">
        {fishImage(filename)}

        <div className="relative px-4 py-2 h-36 w-72 shadow-md -top-12 mx-auto bg-white rounded-lg">
          <div className="flex justify-between">
            <p className="block text-lg capitalize font-semibold text-zinc-600 truncate mt-1">
              {species}
            </p>

            <Menu as="div" className="relative inline-block text-left mt-2">
              <div>
                <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/fishing_logs/${fish_id}/edit`}
                          className={classNames(
                            active
                              ? "bg-zinc-100 text-zinc-900"
                              : "text-zinc-700",
                            "group flex items-center px-4 py-2 text-sm"
                          )}
                        >
                          <PencilSquareIcon
                            className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-zinc-500"
                            aria-hidden="true"
                          />
                          Edit
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="#"
                          onClick={() => handleDelete(fish_id)}
                          className={classNames(
                            active
                              ? "w-full bg-zinc-100 text-zinc-900"
                              : "text-zinc-700",
                            "group flex items-center px-4 py-2 text-sm"
                          )}
                        >
                          <TrashIcon
                            className="mr-3 h-5 w-5 text-zinc-400 group-hover:text-zinc-500"
                            aria-hidden="true"
                          />
                          Delete
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <ul className="block text-base font-medium text-zinc-800">
            <li>
              Length: {fish_length}
              <span className="text-xs">in</span>
            </li>
            <li>
              Weight: {pounds}
              <span className="text-xs">lbs</span>
              <span className="ml-2">
                {ounces}
                <span className="text-xs">oz</span>
              </span>
            </li>
            <li>Bait: {bait}</li>
            <li>Method: {fishing_method}</li>
          </ul>
        </div>
      </div>
    );
  });
}
