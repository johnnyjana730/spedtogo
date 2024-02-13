from .local_storage import LocalStorage
from .output import Output
from .utils import sleep_for_n_seconds
from .ip_utils import get_valid_ip
from .beep_utils import beep_input
import os
import json
import pydash

def prompt_change_ip(should_beep):
    current_ip = get_valid_ip()
    seen_ips =  LocalStorage.get_item("seen_ips", [])
    
    next_prompt = "Please change your IP and press Enter to continue..."
    
    while True:
        beep_input(next_prompt, should_beep)
        new_ip = get_valid_ip()

        if new_ip == current_ip:
            next_prompt = """In order to proceed, it is necessary to change your IP address as a precautionary measure against Bot Detection. Please visit https://www.omkar.cloud/botasaurus/docs/guides/change-ip/ to learn how to change your IP. Once you have successfully changed your IP address, please press Enter to continue..."""

        elif new_ip in seen_ips:
            next_prompt = "Your computer previously had this IP address. Please change your IP and press Enter to continue..."
        else:
            LocalStorage.set_item("seen_ips", LocalStorage.get_item("seen_ips", []) + [current_ip])
            return new_ip

def launch_tasks(*tasks):
    for Task in tasks: 
        print('Task Started')

        task  = Task()
        task_config = task.get_task_config()
        data, city = task.get_data()
        if type(data) is not list:
            data = [data]

        should_first_beep = len(tasks) > 1

        if len(data) > 0:
            if task_config.prompt_to_close_browser: 
                prompt_message = f"Kindly close other browsers where {task_config.target_website} is open to prevent detection from {task_config.target_website} and press enter to continue..."
                beep_input(prompt_message, task_config.beep and should_first_beep)

            if task_config.change_ip: 
                prompt_change_ip(task_config.beep and should_first_beep)
        
        
        schedules = task.schedule(data)

        output = []
        for index in range(len(data)):
            current_data = data[index]
            delay = schedules[index]['delay']

            print('keyword = ', current_data['keyword'])

            if current_data['job_type'] == 'google_map':
                output_file_path = './output/' + city + '/' + pydash.kebab_case(current_data['keyword']) + '.json'
            elif  current_data['job_type'] == 'google_search':
                output_file_path = './output/search/' + city + '/' + pydash.kebab_case(current_data['keyword']) + '.json'

            task_begin = False
            if os.path.exists(output_file_path):
                with open(output_file_path, 'r') as file:
                    current_output = json.load(file)

            else:
                task_begin = True
                current_output = task.begin_task(current_data, task_config)

            if current_output == None or len(current_output) == 0:
                current_output = [{}]


                if os.path.exists('./output/search/' + city + '/') == False:
                    os.makedirs('./output/search/' + city + '/')

                if os.path.exists('./output/' + city + '/') == False:
                    os.makedirs('./output/' + city + '/')

                with open(output_file_path, 'w') as file:
                    json.dump([{}], file)

            print('result = ', current_output)
            print('')

            if current_data['job_type'] == 'google_map':
                if current_output != None and len(current_output) > 0:
                    current_output[0]['keyword'] = current_data['keyword']
                    current_output[0]['extracted_place_name'] = current_data['extracted_place_name']
                    current_output[0]['xhs_note_list'] = current_data['xhs_note_list']
            
            elif current_data['job_type'] == 'google_search':
                n_current_output = {}
                n_current_output['google_search_data'] = current_output
                n_current_output['keyword'] = current_data['keyword']
                n_current_output['found_place_name'] = current_data['found_place_name']
                n_current_output['job_type'] = current_data['job_type']
                current_output = [n_current_output]


            if type(current_output) is dict:
                current_output = [current_output]

            if type(current_output) is list:
                output = output + current_output

            if task_begin:
                if len(output) > 0: 
                    Output.write_json(output, task_config.output_filename)

                if task_config.change_ip: 
                    prompt_change_ip(task_config.beep)

                if delay > 0:
                    is_last = index == len(data) -1
                    if is_last:
                        pass
                    else:
                        sleep_for_n_seconds(delay)

        # print('Task Completed!')

        return output
        # if len(output) > 0: 
        #     Output.write_json(output, task_config.output_filename)
        #     Output.write_csv(output, task_config.output_filename)