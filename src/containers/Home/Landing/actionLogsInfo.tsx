import React, { useContext, useEffect, useMemo, useState } from "react";
import { flattenDeep, get, isString } from "lodash";
import moment from "moment";

import ReactStringReplacer from "../../../utils/reactStringReplacer";
import EventMessageContext, { EventMessage } from "../../../context/eventmessage";
import DataIcon from "../../../components/DataIcon";
import ProfileCard from "../../../components/ProfileCard";
import InfiniteList from "@/components/InfiniteList";

const alreadyVisitedItems = new Set<EventMessage>();

const RowRenderer = ({ index, style }: { data: EventMessage[], index: number, style: React.CSSProperties }) => {
  const { messages: msg } = useContext(EventMessageContext);
  const item = useMemo(() => get(msg, index), [msg, index]);
  const [isVisible, setIsVisible] = useState<boolean>(alreadyVisitedItems.has(item) || index >= 10);

  const messages = useMemo(() => {
    let result = [get(item, "publishInfo.message")];
    const linkifyString = (textData: string[], textToLink: RegExp | string, link: string) =>
      textData.map((msg: string) =>
        ReactStringReplacer(msg, textToLink, (match: React.ReactNode, i: number) => (
          <a key={`${match} ${i}`} className="font-bold hover:cursor-pointer" href={link} target="_blank" rel="noopener noreferrer">
            {match}
          </a>
        ))
      );
    result = get(item, "publishInfo.subject")
      ? flattenDeep(
        linkifyString(
          result,
          get(item, "publishInfo.subject"),
          get(item, "publishInfo.subjectLink")
        )
      )
      : result;
    result = get(item, "publishInfo.target")
      ? flattenDeep(
        linkifyString(
          result,
          get(item, "publishInfo.target"),
          get(item, "publishInfo.targetLink")
        )
      )
      : result;
    return result;
  }, [item]);

  useEffect(() => {
    if (!alreadyVisitedItems.has(item) && index < 10) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        alreadyVisitedItems.add(item);
      }, 100 + index * 50); // Delay based on index
    return () => clearTimeout(timer);
    }
  }, [item, index]);

  const animationStyle = index < 10 ? (isVisible ? {
    opacity: 1,
    transform: 'translateX(0%)',
    transition: `opacity 350ms ease-in, transform 350ms ease-in`,
  } : {
    opacity: 0,
    transform: 'translateX(-10%)',
  }) : {};
  return (
    <div style={style}>
      <div
        className="rounded-lg bg-muted border-input border-1 text-input pr-4 flex flex-nowrap gap-2 align-center items-center"
        style={{ width: "100%", height: 70, overflow: "auto" }}
      >
        <div className="sticky left-0 flex flex-nowrap gap-2 align-center items-center bg-muted h-full pl-4 pr-1" style={animationStyle}>
          <DataIcon
            href={get(item, "publishInfo.icon.link")}
            value={get(item, "publishInfo.icon.value")}
            type={get(item, "publishInfo.icon.type")}
          />
        </div>
        <div className="flex flex-col gap-1 text-left grow px-1 scroll-auto w-fit" style={animationStyle}>
          <span className="text-base flex flex-nowrap justify-start gap-2 items-center">{messages.filter(item => item).map((msg, i) =>
            isString(msg) ? (
              <span key={`${msg} ${i}`} className="flex flex-nowrap text-nowrap text-input">
                {msg}
              </span>
            ) : (
              <span className="flex flex-nowrap text-nowrap" key={`${msg} ${i}`}>{msg}</span>
            )
          )}</span>
          <span className="flex flex-nowrap text-sm text-input italic">{moment(item && item.createdAt).format("MM/DD/YY hh:mm a")}</span>
        </div>
      </div>
    </div>
  );
};

const height = 360;

export default function ActionLogsInfo() {
  const { messages, newMessages, fetchMore, loading, isDataComplete } = useContext(EventMessageContext);
  return (
    <ProfileCard
      header={<span className="text-2xl text-input">What I've been doing</span>}
      contentStyle={{
        paddingLeft: 16,
        paddingRight: 16,
        height,
      }}
      cardStyle={{ maxWidth: 1200, margin: "0 auto" }}
    >
      <div className="min-sm:px-12">
        <InfiniteList
          parentHeight={`${height}px`}
          isFetchingItems={loading}
          fetchMore={fetchMore}
          newItems={newMessages}
          items={messages}
          RowRenderer={RowRenderer}
          dataCompleted={isDataComplete}
        />
      </div>
    </ProfileCard>
  );
}