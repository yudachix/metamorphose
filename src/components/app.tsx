"use client";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "@mui/material/Link";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { fetchDictionary } from "@/utils/dict/fetch";
import { choice } from "@/utils/random";
import { defaultTitle } from "@/utils/consts";

export type DicionaryDefine = {
  displayName: string,
  path: string
};

const dictionaryDefines: DicionaryDefine[] = [
  {
    displayName: "ことわざ・慣用句",
    path: "proverb"
  },
  {
    displayName: "映画のタイトル",
    path: "movie"
  }
] as const;

export type GeneratedSentence = {
  original: string,
  sentence: string
};

export default function App() {
  const [title, setTitle] = useState(defaultTitle);
  const [contamination, setContamination] = useState("俺");
  const [dictDefine, setDictDefine] = useState(dictionaryDefines[0] as DicionaryDefine);
  const [dictPath, setDictPath] = useState(dictDefine.path);
  const [sentenceCount, setSentenceCount] = useState<number>();
  const [generated, setGenerated] = useState<GeneratedSentence>();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      const dict = await fetchDictionary(dictPath);

      setSentenceCount(dict.sentences.length);
    })();

    const dictDefine = dictionaryDefines.find(define => define.path === dictPath);

    if (dictDefine) {
      setDictDefine(dictDefine);
    }
  }, [dictPath]);

  useEffect(() => {
    const title = `${dictDefine.displayName}の一部を${contamination && `「${contamination}」に`}変えると`;

    document.title = title;
    setTitle(title);
  }, [contamination]);

  const googleLink = (
    generated
      ? (
        <Box>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.google.com/search?q=${encodeURIComponent(generated.original)}`}
          >
            この{dictDefine.displayName}をググる
          </Link>
        </Box>
      )
      : undefined
  );

  return (
    <Box
      sx={{
        minWidth: "100svw",
        minHeight: "100svh",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(images/paper.png)"
      }}
    >
      <Container>
        <Stack padding={2} spacing={2}>
          <Typography variant="h5" component="h1">{title}</Typography>
          <Stack>
            <FormControl fullWidth size="small">
              <InputLabel>辞書</InputLabel>
              <Select
                label="辞書"
                value={dictPath}
                onChange={async event => {
                  setGenerated(undefined);
                  setDictPath(event.target.value);
                }}
              >
                {dictionaryDefines.map(define => (
                  <MenuItem
                    value={define.path}
                    key={define.path}
                  >
                    {define.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography fontSize="small" color="text.secondary">収録されている文章の数：{sentenceCount === undefined ? "取得中" : sentenceCount.toString()}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              label="置換後の単語"
              placeholder="例：俺"
              size="small"
              value={contamination}
              onChange={event => setContamination(event.target.value)}
            />
            <Button
              variant="contained"
              onClick={async () => {
                const dict = await fetchDictionary(dictPath);
                const selectedSentence = choice(dict.sentences);
                const selectedNounIndex = choice(selectedSentence.nounIndexes);
                let sentence = "";

                for (const [index, word] of selectedSentence.words.entries()) {
                  sentence += index === selectedNounIndex ? contamination : word;
                }

                setGenerated({
                  sentence,
                  original: selectedSentence.original
                });
              }}
            >
              生成
            </Button>
          </Stack>
          {generated && (
            <Stack spacing={1}>
              <Stack
                spacing={isSmallScreen ? 1 : 5}
                direction={isSmallScreen ? "column" : "row"}
                alignItems={isSmallScreen ? "flex-start" : "center"}
              >
                <Stack spacing={1} flex={1}>
                  <Typography variant="h6" component="h2">{dictDefine.displayName}</Typography>
                  <Typography color="text.secondary">{generated.original}</Typography>
                  {isSmallScreen && googleLink}
                </Stack>
                {isSmallScreen && <ArrowDropDownIcon fontSize="large" />}
                {!isSmallScreen && <ArrowRightIcon fontSize="large" />}
                <Stack spacing={1} flex={1}>
                  <Typography variant="h6" component="h2">変換後</Typography>
                  <Typography color="text.secondary">{generated.sentence}</Typography>
                </Stack>
              </Stack>
              {!isSmallScreen && googleLink}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
