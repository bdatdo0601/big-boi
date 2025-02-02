import React, { useContext, useEffect, useMemo } from "react";
import { flattenDeep, get, isString } from "lodash";
import moment from "moment";
import { animated, useSpring } from "@react-spring/web";

import ReactStringReplacer from "../../../utils/reactStringReplacer";
import EventMessageContext, { EventMessage } from "../../../context/eventmessage";
import DataIcon from "../../../components/DataIcon";
import ProfileCard from "../../../components/ProfileCard";
import LayoutContext from "../../../context/layout";
import InfiniteList from "@/components/InfiniteList";

const AnimatedDiv = animated.div as any;

const RowRenderer = (items: EventMessage[], alreadyVisitedIndexes: Set<EventMessage>, setAlreadyVisitedIndexes: Function) => ({ index, style }: { index: number, style: React.CSSProperties }) => {
  const item = useMemo(() => items[index], [items, index]);

  const [animateProps] = useSpring(() => ({
    from: { opacity: alreadyVisitedIndexes.has(item) ? 1 : 0 },
    to: { opacity: 1 },
    config: { duration: 300 },
  }));

  const messages = useMemo(() => {
    let result = [get(item, "publishInfo.message")];
    const linkifyString = (textData: string[], textToLink: RegExp | string, link: string) =>
      textData.map((msg: string) =>
        ReactStringReplacer(msg, textToLink, (match: React.ReactNode, i: number) => (
          <a key={`${match} ${i}`} className="font-bold border-b-1 border-primary pb-0.5 hover:cursor-pointer" href={link} target="_blank" rel="noopener noreferrer">
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
    setTimeout(() => {
      setAlreadyVisitedIndexes((prev: Set<EventMessage>) => { prev.add(item); return prev });
    }, 1000);
  }, [item, setAlreadyVisitedIndexes]);

  return (
    <AnimatedDiv style={{ ...style, ...(animateProps as any) }}>
      <div
        className="rounded-lg bg-muted border-input border-1 text-input pr-4 py-1 h-full flex flex-nowrap gap-2 align-center items-center"
        style={{ width: "100%", height: 70, overflow: "auto" }}
      >
        <div className="sticky left-0 flex flex-nowrap gap-2 align-center items-center bg-muted h-full pl-4 pr-1">
          <DataIcon
            href={get(item, "publishInfo.icon.link")}
            value={get(item, "publishInfo.icon.value")}
            type={get(item, "publishInfo.icon.type")}
          />
        </div>
        <div className="flex flex-col gap-1 text-left grow px-1 scroll-auto w-fit">
          <span className="text-sm flex flex-nowrap justify-start gap-1">{messages.filter(item => item).map((msg, i) =>
            isString(msg) ? (
              <span key={`${msg} ${i}`} className="flex flex-nowrap text-nowrap text-input">
                {msg}
              </span>
            ) : (
              <span className="flex flex-nowrap text-nowrap" key={`${msg} ${i}`}>{msg}</span>
            )
          )}</span>
          <span className="flex flex-nowrap text-xs text-input italic">{moment(item && item.createdAt).format("MM/DD/YY hh:mm a")}</span>
        </div>
      </div>
    </AnimatedDiv>
  );
};

const height = 400;

export default function ActionLogsInfo() {
  const { messages, newMessages, fetchMore, loading, isDataComplete } = useContext(EventMessageContext);
  const { globalAnimation } = useContext(LayoutContext);
  return (
    <ProfileCard
      header={<span className="text-2xl text-input">What I've been doing</span>}
      contentStyle={{
        paddingLeft: 16,
        paddingRight: 16,
        height,
      }}
      animation={globalAnimation}
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