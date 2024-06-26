'use client'

import { AsideContext } from "@/libs/contexts/AsideContext";
import { useContext, useEffect } from "react";
import ChartSection from "@/ui/charts/section";
import BarChartView from "@/ui/charts/bar";
import LineChartView from "@/ui/charts/line";
import FeedSection from "./feed";

export default function Home() {
  const { asideDispatch } = useContext(AsideContext)

  useEffect(() => {
    asideDispatch({
      type: 'SET_NAVIGATION',
      payload: []
    });
  }, [asideDispatch]);

  return (
    <>
      <ChartSection>
        <ChartSection.Title>Bar</ChartSection.Title>
        <BarChartView />
      </ChartSection>
      <div className="grid grid-cols-1 md:grid-cols-2">
      <ChartSection>
        <ChartSection.Title>Line</ChartSection.Title>
        <LineChartView />
      </ChartSection>
      <FeedSection/>
      </div>
    </>
  );
}
