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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import prettyBytes from 'pretty-bytes';

type DownloadOption = {
  filesize: number;
  format: string;
  height: number;
  width: number;
  url: string;
  name: string;
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
  const [videoUrl, setVideoUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<Array<DownloadOption>>([]);
  const [title, setTitle] = React.useState<string>('');
  const [err, setErr] = React.useState<string>('');
  const largeScreen = useMediaQuery('(min-width:600px)');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('url')) {
      console.log('setting url', { url: params.get('url') });
      setVideoUrl(params.get('url'));
    }
  }, []);

  const onVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = videoUrl || 'https://www.youtube.com/watch?v=y8Kyi0WNg40';

    try {
      fetch('/api/download', { method: 'POST', body: JSON.stringify({ videoUrl: url }) })
        .then((r) => r.json())
        .then((res) => {
          const options: Array<DownloadOption> = res.options;
          const error: string = res.error;
          const title: string = res.title;
          if (options && title) {
            setOptions(options);
            setTitle(res.title);
          } else {
            setErr(error);
          }
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setErr(e);
    }
  };
  const onButtonClick = (e) => {
    if (options.length === 0) return onSubmit(e);
    setOptions([]);
  };
  return (
    <NoSsr>
      <Head>
        <title>Vid Keeper</title>
        <meta name="application-name" content="Vid Keeper" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vid Keeper" />
        <meta name="description" content="Best Vid Keeper in the world" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Box display="flex" height="100%" flexDirection="column">
        <Container>
          <Box display="flex" flexDirection="column" mt={4} style={{}}>
            <Typography align="center" variant="h5" gutterBottom>
              A super simple video downloader with no ads, no tracking and no cookies.
            </Typography>
            <Box mt={2} />
            <Typography variant="body1">
              Enter the url of any page with a video below and it will try to fetch you links to be able to download
              them
            </Typography>
            <form onSubmit={onSubmit} className={classes.form}>
              <Box mt={4} display="flex" justifyContent="center" flexDirection="column">
                <TextField
                  id="video-url"
                  label="Video Url"
                  placeholder="https://www.youtube.com/watch?v=y8Kyi0WNg40"
                  value={videoUrl}
                  onChange={onVideoUrlChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Box mt={4} />
                <Box display="flex" justifyContent="center">
                  {loading && <CircularProgress />}
                </Box>
                {!loading && options.length > 0 && (
                  <Box mb={12} display="flex" flexDirection="column">
                    <Typography>Video: {title}</Typography>
                    <Box mt={2} />
                    <TableContainer
                      component={largeScreen ? Paper : Box}
                      style={{ width: largeScreen ? '80%' : '100%', alignSelf: 'center' }}
                    >
                      <Table aria-label="download links">
                        <TableHead>
                          <TableRow>
                            <TableCell>Size</TableCell>
                            <TableCell>Format</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {options.map((row) => (
                            <TableRow key={row.format}>
                              <TableCell component="th" scope="row">
                                {row.filesize ? prettyBytes(row.filesize) : '-'}
                              </TableCell>
                              <TableCell>{row.format}</TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell align="right">
                                <a href={row.url} target="_blank" rel="noopener noreferrer">
                                  <Tooltip title="Right click > Save Link As...">
                                    <GetAppIcon htmlColor="#aaa" />
                                  </Tooltip>
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                {!!err && (
                  <Box>
                    <pre>{JSON.stringify(err, null, 2)}</pre>
                  </Box>
                )}
              </Box>
            </form>
            <Box flexGrow={1} />
            <Box position="fixed" bottom={24} right={0} width="100%" display="flex" justifyContent="center">
              <Button
                style={{ width: largeScreen ? '50%' : '80%' }}
                variant="contained"
                color="primary"
                onClick={onButtonClick}
                disabled={loading}
              >
                {options.length === 0 ? 'Download' : 'Clear'}
              </Button>
              <Box mt={4} />
            </Box>
          </Box>
        </Container>
      </Box>
    </NoSsr>
  );
}
