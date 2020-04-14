import { ERROR_ACCESS_DENIED, ERROR_PROJECT_DOES_NOT_EXIST } from "models/Constants";
import ProjectEnum from "enums/ProjectEnum";

export default {
  project1: {
    success: true,
    data: {
      projectId: 1,
      userId: 5,
      title: "Project 1",
      type: ProjectEnum.PROJECT,
      access: 0,
      description: null,
      tags: null,
      price: null,
      createdAt: "2020-04-12T11:09:16.490Z",
      updatedAt: "2020-04-12T11:09:16.490Z",
      deletedAt: null,
      versions: [{
        versionId: 1,
        data: {
          mode: 1,
          title: "Project 1",
          screens: [{
            id: "2ad2e232-5ade-4714-b68a-227531d3b47b",
            type: "Grid",
            title: "Screen",
            children: [{
              id: "6757b7f3-99dc-48c1-8526-7e62c5399873",
              type: "Grid",
              title: "Grid",
              children: [],
              parentId: "2ad2e232-5ade-4714-b68a-227531d3b47b",
              cssStyles: [],
              allowChildren: true,
              lockedChildren: false,
            }],
            cssStyles: [
              ["Main",
                [{
                  key: "padding",
                  value: "15px",
                  enabled: true,
                  category: "alignChildren",
                  expanded: false,
                  valueType: "string",
                  defaultValue: 0
                }, {
                  key: "display",
                  value: "flex",
                  enabled: true,
                  category: "alignChildren",
                  valueType: "select",
                  defaultValue: "flex"
                }]
              ]
            ],
            allowChildren: true,
            lockedChildren: false,
          }],
          background: { backgroundColor: "#FFFFFF" },
          statusBarColor: "#FFFFFF",
        },
        requestShare: false,
        approvedShare: false,
        createdAt: "2020-04-12T11:09:16.503Z",
        updatedAt: "2020-04-12T11:09:16.503Z",
      }],
    },
  },
  projectDoesNotExists: {
    success: false,
    error: ERROR_PROJECT_DOES_NOT_EXIST
  },
  projectAccessDenied: {
    success: false,
    error: ERROR_ACCESS_DENIED
  }
}
