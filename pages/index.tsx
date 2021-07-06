import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  NoSsr,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import Head from 'next/head';
import Image from 'next/image';
import React, { useRef } from 'react';
import prettyBytes from 'pretty-bytes';

type DownloadOption = {
  filesize: number;
  format: string;
  height: number;
  width: number;
  url: string;
};

const useStyles = makeStyles((theme) => ({
  container: {},
  menuButton: {
    marginRight: theme.spacing(2),
    background: '#4caf50',
  },
  form: {
    minWidth: '100%',
  },
}));

export default function Home() {
  const classes = useStyles();
  const [videoUrl, setVideoUrl] = React.useState<string>('https://www.youtube.com/watch?v=y8Kyi0WNg40');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<Array<DownloadOption>>([]);
  const [title, setTitle] = React.useState<string>('');
  const [err, setErr] = React.useState<string>('');

  const onVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      fetch('/api/download', { method: 'POST', body: JSON.stringify({ videoUrl }) })
        .then((r) => r.json())
        .then((res) => {
          const options: Array<DownloadOption> = res.options;
          setOptions(options);
          setTitle(res.title);
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setErr(e);
    }
  };
  return (
    <NoSsr>
      <Box>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <VideoLibraryIcon />
            </IconButton>
            <Typography variant="h6">Vid Keeper</Typography>
          </Toolbar>
        </AppBar>
        <Box pt={12} />
        <Container>
          <Typography align="center">My own private video downloader!</Typography>
          <form onSubmit={onSubmit} className={classes.form}>
            <Box mt={4} display="flex" justifyContent="center" flexDirection="column">
              <TextField
                id="video-url"
                label="Video Url"
                placeholder="https://www.youtube.com/watch?v=y8Kyi0WNg40"
                defaultValue=""
                onChange={onVideoUrlChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Box mt={4} />
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                Download
              </Button>
              <Box mt={4} />
              <Box display="flex" justifyContent="center">
                {loading && <CircularProgress />}
              </Box>
              {!loading && options.length > 0 && (
                <Box>
                  <Typography>{title}</Typography>
                  {options
                    // .sort((a, b) => a.filesize - b.filesize)
                    .map((o) => (
                      <Box key={o.url} mt={2}>
                        <a href={o.url}>
                          {o.filesize ? prettyBytes(o.filesize) : '? Mb'} | {o.format}
                        </a>
                      </Box>
                    ))}
                </Box>
              )}
              {err.length > 0 && (
                <Box>
                  <pre>{err}</pre>
                </Box>
              )}
            </Box>
          </form>
        </Container>
      </Box>
    </NoSsr>
  );
}
