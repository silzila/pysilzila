import logging

# create a custom logger
logger = logging.getLogger(__name__)
# create 2 handlers for logging -> console for WARNING, file for ERROR
handler_console = logging.StreamHandler()
handler_file = logging.FileHandler("logger.log")
handler_console.setLevel(logging.WARNING)
handler_file.setLevel(logging.ERROR)
# add formatter and set to loggerr handlers
format_console = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
format_file = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler_console.setFormatter(format_console)
handler_file.setFormatter(format_file)
# add handlers to logger
logger.addHandler(handler_console)
logger.addHandler(handler_file)
