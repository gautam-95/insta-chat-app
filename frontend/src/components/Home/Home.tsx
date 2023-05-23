import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Login from "../Authentication/Login/Login.component";
import Signup from "../Authentication/Signup/Signup.component";
import './Home.css';

const Home = () => {
  const history = useHistory();
  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    const user = userData && JSON.parse(userData);

    if(user) {
        history.push('/chats');
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
       className="homeHeader"
      >
        <Text className="homeTitle">
          InstaChat
        </Text>
      </Box>
      <Box
        className="homeTabs"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab className="tab">Login</Tab>
            <Tab className="tab">Sign-up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
