'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Spinner,
  Button,
} from "@heroui/react";
import { AppDispatch, RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { GetFavoriteQuote ,deleteFavoriteQuote } from "@/app/store/quoteSlice";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { quotes, status, token, last_page } = useSelector((state: RootState) => state.quotes);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (token) {
      dispatch(GetFavoriteQuote({ token }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    console.log("Updated quotes state:", quotes);
    console.log("Last page:", last_page);
  }, [quotes, last_page]); 

  const pages = last_page;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return Array.isArray(quotes) ? quotes.slice(start, end) : [];
  }, [page, quotes]);

  const handleDelete = (id: number) => {
    if (token) {
      dispatch(deleteFavoriteQuote({ id, token }));
    } else {
      console.error("Token is null");
    }
  };

  if (status === 'loading') {
    return <Spinner variant="dots"/>;
  }

  return (
    <Table
      aria-label="Example table with client-side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="content">CONTENT</TableColumn>
        <TableColumn key="author">AUTHOR</TableColumn>
        <TableColumn key="actions">ACTIONS</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.content}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>
              <Button color="danger" variant="bordered" onClick={() => handleDelete(item.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}