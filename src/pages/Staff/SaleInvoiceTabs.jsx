import React, { useEffect, useState } from "react";
import { Tabs, Button, Layout } from "antd";
import OwnerSidebar from "../../components/layout/StoreOwner/OwnerSidebar";
import AppHeader from "../../components/layout/Header";
import AppFooter from "../../components/layout/Footer";
import SaleView from "../../components/SaleInvoices/SaleView";
import StaffSidebar from "../../components/layout/Staff/StaffSidebar";
import PageTitle from "../../components/layout/PageTitle";
const { Content } = Layout;

const SaleInvoiceTabs = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [panes, setPanes] = useState([
    {
      title: "Hóa đơn 1",
      content: <SaleView tabKey="1" />,
      key: "1",
      closable: false,
    },
  ]);

  useEffect(() => {
    const savedTabKeys = localStorage.getItem("saleInvoiceTabKeys");
    const savedActiveKey = localStorage.getItem("saleInvoiceActiveKey");
    if (savedTabKeys && savedActiveKey) {
      const parsedTabKeys = JSON.parse(savedTabKeys);
      const restoredPanes = parsedTabKeys.map((key, index) => ({
        title: `Hóa đơn ${index + 1}`,
        content: <SaleView tabKey={key} />,
        key: key,
        closable: true,
      }));
      setPanes(restoredPanes);
      setActiveKey(savedActiveKey);
    }
  }, []);

  const updateTabsInStorage = (newPanes) => {
    const saleTabKeys = newPanes.map((pane) => pane.key);
    localStorage.setItem("saleInvoiceTabKeys", JSON.stringify(saleTabKeys));
    // localStorage.setItem("saleInvoiceActiveKey", activeKey);
  };

  const add = () => {
    const newTabKey = `saleInvoiceTab_${new Date().getTime()}`;
    const newPanes = [
      ...panes,
      {
        title: `Hóa đơn ${panes.length + 1}`,
        content: <SaleView tabKey={newTabKey} />,
        key: newTabKey,
        closable: true,
      },
    ];
    setPanes(newPanes);
    setActiveKey(newTabKey);
    localStorage.setItem("saleInvoiceActiveKey", newTabKey);
    updateTabsInStorage(newPanes);
  };

  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex;

    // Xác định vị trí của tab hiện tại
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });

    // Loại bỏ tab và cập nhật panes
    const newPanes = panes.filter((pane) => pane.key !== targetKey);

    // Xác định tab sẽ trở thành active
    if (newPanes.length) {
      if (newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
        } else {
          newActiveKey = newPanes[0].key;
        }
      }
    } else {
      newActiveKey = null;
    }

    // Cập nhật panes và activeKey
    setPanes(newPanes);
    setActiveKey(newActiveKey);
    localStorage.setItem("saleInvoiceActiveKey", newActiveKey);

    // Cập nhật localStorage cho panes và activeKey
    updateTabsInStorage(newPanes);

    // Xóa trạng thái của tab khỏi localStorage
    const saleTabStates =
      JSON.parse(localStorage.getItem("saleTabStates")) || {};
    delete saleTabStates[targetKey];
    localStorage.setItem("saleTabStates", JSON.stringify(saleTabStates));
  };

  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
    localStorage.setItem("saleInvoiceActiveKey", newActiveKey);
  };

  const onEdit = (targetKey, action) => {
    if (action === "remove") {
      remove(targetKey);
    }
  };

  const pageTitle = "Bán hàng";
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <StaffSidebar />
        <Layout>
          <AppHeader />
          <PageTitle pageTitle={pageTitle} />
          <Content style={{ padding: "0px 20px", marginTop: 20 }}>
            <Tabs
              hideAdd
              onChange={onChange}
              activeKey={activeKey}
              type="editable-card"
              onEdit={onEdit}
              tabBarExtraContent={{
                right: (
                  <span
                    style={{
                      cursor: "pointer",
                      fontSize: "18px",
                      marginRight: "16px",
                    }}
                    onClick={add}
                  >
                    +
                  </span>
                ),
              }}
            >
              {panes.map((pane) => (
                <Tabs.TabPane
                  tab={pane.title}
                  key={pane.key}
                  closable={pane.closable}
                >
                  {pane.content}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    </>
  );
};

export default SaleInvoiceTabs;
