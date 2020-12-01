import { useState, useEffect, useRef } from "react";
import React from "react";
import styles from "./style.module.css";
import songState from "../../mobx/songState";
import { observer } from "mobx-react";
import { PLAYING } from "../../util/constant";

function formatLyric(lyrics, tlyrics) {
  if (lyrics === null) {
    return [
      {
        word: "纯音乐，请您欣赏",
        t_word: "",
      },
    ];
  }

  let timeAndword = lyrics.split("\n");
  let lyric = [];
  let tlyric = [];

  //翻译部分
  if (tlyrics !== null) {
    let trans = tlyrics.split("\n");
    trans.forEach(function (item) {
      let t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
      let w = item.substring(item.indexOf("]") + 1, item.length);
      //双重歌词
      if (w.indexOf("[") !== -1) {
        let tt = w.substring(w.indexOf("[") + 1, w.indexOf("]"));
        let ww = w.substring(w.indexOf("]") + 1, w.length);
        if (ww === "") return;
        tlyric.push({
          time: (tt.split(":")[0] * 60 + parseFloat(tt.split(":")[1])).toFixed(
            3
          ),
          word: ww,
        });
      } else {
        if (w === "") return;
        tlyric.push({
          time: (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3),
          word: w,
        });
      }
    });
  }

  timeAndword.forEach(function (item, index) {
    let t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
    let w = item.substring(item.indexOf("]") + 1, item.length);
    //双重歌词
    if (w.indexOf("[") !== -1) {
      let tt = w.substring(w.indexOf("[") + 1, w.indexOf("]"));
      let ww = w.substring(w.indexOf("]") + 1, w.length);
      if (ww === "") return;
      let t_word;
      let time = (tt.split(":")[0] * 60 + parseFloat(tt.split(":")[1])).toFixed(
        3
      );
      if (tlyric.length !== 0) {
        for (let i = 0; i < tlyric.length; i++) {
          if (tlyric[i].time === time) {
            t_word = tlyric[i].word;
          }
        }
      } else t_word = "";
      lyric.push({
        time: time,
        word: ww,
        t_word: t_word,
      });
    } else {
      if (w === "") return;
      let t_word;
      let time = (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(
        3
      );
      if (tlyric.length !== 0) {
        for (let i = 0; i < tlyric.length; i++) {
          if (tlyric[i].time === time) {
            t_word = tlyric[i].word;
          }
        }
      } else t_word = "";

      lyric.push({
        time: time,
        word: w,
        t_word: t_word,
      });
    }
  });
  let comparer = function (obj1, obj2) {
    return parseFloat(obj1.time) - parseFloat(obj2.time);
  };

  return lyric.sort(comparer);
}
function Lyric(props) {
  const [line, setLine] = useState(0);
  const currentRequestAnimationFrame = useRef();
  const currentLineIndex = useRef();
  const formattedLyric = formatLyric(props.lyric, props.tlyric);
  const lineHeight = props.tlyric ? 60 : 45;
  function LyricScroll() {
    if (songState.playStatus !== PLAYING) {
      window.cancelAnimationFrame(currentRequestAnimationFrame.current);
      return;
    }
    const audioTime = document.getElementById("music").currentTime.toFixed(3);
    const lineIndex = formattedLyric.findIndex((item, index, arr) => {
      const prev =
        index - 1 >= 0
          ? parseFloat(arr[index - 1].time)
          : parseFloat(item.time);
      const next =
        index + 1 < arr.length
          ? parseFloat(arr[index + 1].time)
          : parseFloat(item.time);
      return prev <= audioTime && next >= audioTime;
    });

    if (lineIndex > -1 && lineIndex !== currentLineIndex.current) {
      const div = document.getElementById("lyricarea");
      if (div && div.scrollTop + div.clientHeight <= div.scrollHeight) {
        console.log(
          lineHeight,
          lineIndex,
          div.clientHeight,
          div.scrollHeight,
          div.scrollTop
        );
        const scrollHeight = lineHeight * lineIndex - div.clientHeight * 0.6;
        console.log(scrollHeight);
        if (scrollHeight > 0) {
          div.scrollTo({
            top: scrollHeight,
            behavior: "smooth",
          });
        }
      }
      setLine(lineIndex);
      currentLineIndex.current = lineIndex;
    }
    currentRequestAnimationFrame.current = window.requestAnimationFrame(
      LyricScroll
    );
  }
  useEffect(() => {
    if (songState.playStatus === PLAYING && formattedLyric.length > 1) {
      currentRequestAnimationFrame.current = window.requestAnimationFrame(
        LyricScroll
      );
    }

    return () => {
      window.cancelAnimationFrame(currentRequestAnimationFrame.current);
    };
    // eslint-disable-next-line
  }, [formattedLyric, songState.playStatus]);

  return (
    <div className={styles.lyric} id="lyricarea">
      {formattedLyric.map(function (item, index) {
        return (
          <div
            key={index}
            style={{ minHeight: "25px", padding: "7px 0" }}
            className={line === index ? styles.highLight : styles.non_highLight}
          >
            <p>{item.word}</p>
            {item.t_word !== "" && <p>{item.t_word}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default observer(Lyric);
