'use client'
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { Spinner } from "@heroui/spinner";
import {addToast} from "@heroui/toast";
import ErrorHandling from "./ErrorHandling";
import { saveQuote } from "@/app/store/quoteSlice";

export default function QuoteCard() {
  const [isFollowed, setIsFollowed] = useState(false);
  const { quote, status, error } = useSelector((state: RootState) => state.quotes);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [token, setToken] = useState('1|AW1W6RhfzUdxHwxbZlbhL1n6EEbECdIz5HCI6UEP761b122a')
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveQuote = () => {
    if (content && author && token && !isFollowed) {
      dispatch(saveQuote({ content, author, token }));
    }
  };

  useEffect(() => {
    if (quote) {
      setContent(quote.content || '');
      setAuthor(quote.author || '');
      setIsFollowed(false);
    }
  }, [quote]);

  return <>
    {status == 'loading' ?
      <Spinner classNames={{ label: "text-foreground mt-4" }} variant="wave" />
      :
      status == 'failed' ? <ErrorHandling error={error} /> :
        <Card className="min-w-[340px]">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://heroui.com/avatars/avatar-1.png"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{quote?.author}</h4>
                <h5 className="text-small tracking-tight text-default-400">@{quote?.author}</h5>
              </div>
            </div>
            <Button
              className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
              disabled={isFollowed}
              color="primary"
              radius="full"
              size="sm"
              variant={isFollowed ? "bordered" : "solid"}
              onPress={() => {
                addToast({
                  title: "Toast title",
                  description: `Toast ${isFollowed ? "unsaved" : "saved"} successfully`,
                  color: "success",
                })
                handleSaveQuote();
                setIsFollowed(!isFollowed)
              }}
            >
              {isFollowed ? "Saved" : "Save"}
            </Button>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-green-400">
            <p>{quote?.content}</p>
          </CardBody>
          <CardFooter className="gap-3">
            {/* <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">4</p>
            <p className=" text-default-400 text-small">Following</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">97.1K</p>
            <p className="text-default-400 text-small">Followers</p>
          </div> */}
          </CardFooter>
        </Card>}
  </>




}
