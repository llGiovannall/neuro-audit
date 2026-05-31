import webview
from bootstrap.config import AppConfig
from bootstrap.os_integration import OsIntegrationService
from bootstrap.di_container import ApplicationContainer
from bootstrap.server_runner import FlaskThreadRunner


def main() -> None:
    config = AppConfig()

    OsIntegrationService.configure_windows_taskbar_icon(config.windows_app_id)

    container = ApplicationContainer(config)

    flask_app = container.build_flask_app()
    server_runner = FlaskThreadRunner(
        app_instance=flask_app, host=config.flask_host, port=config.flask_port
    )
    server_runner.start_as_daemon()

    local_url = f"http://{config.flask_host}:{config.flask_port}"
    _window = container.build_webview_window(url=local_url)

    webview.start(icon=config.logo_path)


if __name__ == "__main__":
    main()
