import React, { useEffect, useState } from "react";
import {Table, Switch, Popconfirm, message, Space, Layout} from "antd";
import StorageLocationAPI from "../../api/StorageLocationAPI";
import { Link } from "react-router-dom"; // Đảm bảo bạn đã import Link
const { Header, Footer, Content } = Layout;

