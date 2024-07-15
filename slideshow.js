'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  $(document).ready(function () {
    tableau.extensions.initializeAsync({ configure: configure }).then(function () {
      // Since dataSource info is attached to the worksheet, we will perform
      // one async call per worksheet to get every dataSource used in this
      // dashboard.  This demonstrates the use of Promise.all to combine
      // promises together and wait for each of them to resolve.
      const dataSourceFetchPromises = [];

      // Maps dataSource id to dataSource so we can keep track of unique dataSources.
      const dashboardDataSources = {};

      // To get dataSource info, first get the dashboard.
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      // This just modifies the UI by removing the loading banner and showing the dataSources table.
      $('#loading').addClass('hidden');
      $('#dataSourcesTable').removeClass('hidden').addClass('show');
      // Then loop through each worksheet and get its dataSources, save promise for later.
      dashboard.worksheets.forEach(function (worksheet) {
        console.log(worksheet.name);
        if (worksheet.name.indexOf('Extension') != -1) {
          readDataW(worksheet);
        }

      });


    }, function (err) {
      // Something went wrong in initialization.
      console.log('Error while Initializing: ' + err.toString());
    });
  });

  async function readDataW(worksheet) {
    const dataTableReader = await worksheet.getSummaryDataReaderAsync();
    const dataTable = await dataTableReader.getAllPagesAsync();
    await dataTableReader.releaseAsync();
    console.log(dataTable);
  }

  // Refreshes the given dataSource.
  function refreshDataSource (dataSource) {
    dataSource.refreshAsync().then(function () {
      console.log(dataSource.name + ': Refreshed Successfully');
    });
  }

  /**
   * Funcion que es llamada cuando el usuario le da click en el botón de configuración
   *
   */
  function configure() {
      const popupUrl = "configure/configure.html";
      let input = "";
      tableau.extensions.ui
          .displayDialogAsync(popupUrl, input, { height: 700, width: 725 })
          .then(closePayload => {
            // console.log('closePayload', objJSON, closePayload)
            // validamos si el modal de configuracion se cerro al guardarse los cambios, en caso contrario no hacemos nada
            if (closePayload == ('success.save')) {

            }
          })
          .catch(error => {
              // One expected error condition is when the popup is closed by the user (meaning the user
              // clicks the 'X' in the top right of the dialog).  This can be checked for like so:
              switch (error.errorCode) {
                  case tableau.ErrorCodes.DialogClosedByUser:
                      console.log("Dialog was closed by user");
                      break;
                  default:
                      console.error(error.message);
              }
          });
  }

})();
